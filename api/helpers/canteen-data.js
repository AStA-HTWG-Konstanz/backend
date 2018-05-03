const request = require('request');
var convert = require('xml-js');
const moment = require('moment');


var data = [];

module.exports = {

  friendlyName: 'canteen Menues Helper',


  description: 'get Meals from Seezeit Server',


  inputs: {

    languageCode: {
      type: 'string',
      example: 'en',
      description: 'meals language ',
      required: true
    }


  },

  exits: {
    success: {
      outputFriendlyName: '',
      outputDescription: ''
    }
  },


  fn: async function (inputs, exits) {

    let endPoint = await sails.helpers.canteenMenues(inputs.languageCode);
    request(endPoint, async(error, response, body) => {
      let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
      let tage = json['speiseplan']['tag'];

      for (let i = 0; i < tage.length; i++) {

        let datum = moment.unix(tage[i]['_attributes']['timestamp']).format("YYYY-MM-DD");
        let speisen = tage[i]['item'];
        console.log(datum);

        data[i] = {};
        data[i]['datum'] = datum;
        data[i]['speisen'] = [];

       let date = await CanteenDate.findOrCreate({
         date: datum
        }, {
         date: datum
       });


        for (let x = 0; x < speisen.length; x++) {
          let languageCode = speisen[x]['_attributes']['language'];
          let category = speisen[x]['category']['_text'];
          let name = speisen[x]['title']['_text'];
          let studentPrice = speisen[x]['preis1']['_text'];
          let employeePrice = speisen[x]['preis2']['_text'];
          data[i]['speisen'][x] = {'Kategorie': category, 'Name': name};


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
  }
};


