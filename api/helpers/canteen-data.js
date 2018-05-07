const request = require('request');
var convert = require('xml-js');
const moment = require('moment');
let async = require('async');


var data = [];

module.exports = {

  friendlyName: 'canteen Menues Helper',


  description: 'get Meals from Seezeit Server',


  exits: {
    success: {
      outputFriendlyName: '',
      outputDescription: ''
    },
    errorOccured: {}
  },


  fn: async function (inputs, exits) {
    async.waterfall([
      function (callback) {
        request(sails.config.custom.seezeit.canteen.deEndpoint, function (error, response, body) {
          if (error) {
            callback(error);
          }

          let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
          callback(null, json);

        });

      },
      function (jsonData, callback) {
        let dates = {};
        async.forEachOfSeries(jsonData['speiseplan']['tag'], function (day, key, cb) {
          let datum = moment.unix(day['_attributes']['timestamp']).format('YYYY-MM-DD');
          let dateMeal = CanteenDate.findOrCreate({
            date: datum
          }, {
            date: datum
          }).then(function (data) {
            dates[datum] = data.id;
            cb();
          }).catch(function (error) {
            sails.log.error(error);
            cb();
          });
        }, function (err) {
          if (err) {
            callback(err);
          } else {
            callback(null, {jsonData: jsonData, dates: dates});
          }
        });
      },
      function (result, callback) {
        async.forEachOfSeries(result.jsonData['speiseplan']['tag'], function (day, key, cb) {
          let parsedDate = moment.unix(day['_attributes']['timestamp']).format('YYYY-MM-DD');
          getMeals(day, result.dates, parsedDate, function (error, result) {
            cb();
          });
        }, function (err) {
          if (err) {
            callback(err);
          } else {
            callback(null, result.dates);
          }
        });

      },
      function (dates, callback) {
        request(sails.config.custom.seezeit.canteen.enEndpoint, function (error, response, body) {
          if (error) {
            callback(error);
          }

          let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
          callback(null, {jsonData: json, dates: dates});

        });
      },
      function (result, callback) {
        async.forEachOf(result.jsonData['speiseplan']['tag'], function (day, key, cb) {
          let parsedDate = moment.unix(day['_attributes']['timestamp']).format('YYYY-MM-DD');

          getMeals(day, result.dates, parsedDate, function (error, result) {
            cb();
          });
        }, function (err) {
          if (err) {
            callback(err);
          } else {
            callback(null, result.dates);
          }
        });

      }
    ], function (error, result) {
      if (error) {
        sails.log.error(error);
        return exits.errorOccured();
      } else {
        return exits.success();
      }
    });


  }
};

function getMeals(day, idList, parsedDate, callback) {
  async.forEachOfSeries(day['item'], function (meal, k, callb) {
    let languageCode = meal['_attributes']['language'];
    let category = meal['category']['_text'];
    let name = meal['title']['_text'];
    let studentPrice = meal['preis1']['_text'];
    let employeePrice = meal['preis2']['_text'];
    if (typeof name === 'undefined') {
      name = 'Holiday';
    }

    CanteenMeal.create({
      language: languageCode,
      category: category,
      title: name,
      studentPrice: studentPrice,
      employeePrice: employeePrice,
      onDate: idList[parsedDate]
    }).then(function (data) {
      callb();
    }).catch(function (error) {
      sails.log(error);
      callb();
    });
  }, function (err) {
    if (err) {
      sails.log(err);
      callback(null);
    } else {
      callback(null);
    }
  });
}
