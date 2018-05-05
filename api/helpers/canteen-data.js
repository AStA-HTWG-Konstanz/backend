const request = require('request');
var convert = require('xml-js');
const moment = require('moment');


var data = [];

module.exports = {

  friendlyName: 'canteen Menues Helper',


  description: 'get Meals from Seezeit Server',


  exits: {
    success: {
      outputFriendlyName: '',
      outputDescription: ''
    }
  },


  fn: async function (inputs, exits) {

    let endPoint = sails.config.custom.seezeit.canteen.deEndpoint;

    for (let i = 0; i < 2; i++) {
      request(endPoint, async (error, response, body) => {
        let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));

        let tage = json['speiseplan']['tag'];

        for (let i = 0; i < tage.length; i++) {

          let datum = moment.unix(tage[i]['_attributes']['timestamp']).format('YYYY-MM-DD');
          let meals = tage[i]['item'];
          console.log(datum);

          data[i] = {};
          data[i]['datum'] = datum;
          data[i]['meals'] = [];

          let date = await CanteenDate.findOrCreate({
            date: datum
          }, {
            date: datum
          });


          for (let x = 0; x < meals.length; x++) {
            let languageCode = meals[x]['_attributes']['language'];
            let category = meals[x]['category']['_text'];
            let name = meals[x]['title']['_text'];
            let studentPrice = meals[x]['preis1']['_text'];
            let employeePrice = meals[x]['preis2']['_text'];

            data[i]['meals'][x] = {'Kategorie': category, 'Name': name};


            await CanteenMeal.create({
              language: languageCode,
              category: category,
              title: name,
              studentPrice: studentPrice,
              employeePrice: employeePrice,
              onDate: date.id
            });
          }

        }
      });
      endPoint = sails.config.custom.seezeit.canteen.enEndpoint;
    }
  }
};


