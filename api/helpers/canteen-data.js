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
    request(endPoint, function (error, response, body) {
      let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
      let tage = json['speiseplan']['tag'];

      for (let i = 0; i < tage.length; i++) {

        let datum = moment.unix(tage[i]['_attributes']['timestamp']).format('DD.MM.YYYY');
        let speisen = tage[i]['item'];

        data[i] = {};
        data[i]['datum'] = datum;
        data[i]['speisen'] = [];

        console.log('Tag: ' + datum);
        for (let x = 0; x < speisen.length; x++) {
          let category = speisen[x]['category']['_text'];
          let name = speisen[x]['title']['_text'];
          data[i]['speisen'][x] = {'Kategorie': category, 'Name': name};
          console.log('Kategorie: ' + category);
          console.log('Name: ' + name);
        }

      }
    });
  }
};


