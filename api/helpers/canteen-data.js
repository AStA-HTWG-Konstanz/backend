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

    createDate();

  }
};

async function createDate() {
  request(sails.config.custom.seezeit.canteen.deEndpoint, async (error, response, body) => {
    let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    let days = json['speiseplan']['tag'];
    for (let i = 0; i < days.length; i++) {
      let datum = moment.unix(days[i]['_attributes']['timestamp']).format('YYYY-MM-DD');
      data[i] = {};
      data[i]['datum'] = datum;
      data[i]['meals'] = [];

      let dateMeal = await CanteenDate.findOrCreate({
        date: datum
      }, {
        date: datum
      });

      getMeals(sails.config.custom.seezeit.canteen.deEndpoint, dateMeal,i);
      getMeals(sails.config.custom.seezeit.canteen.enEndpoint, dateMeal,i);

    }

  });
}
/*
async function parseXML(body) {
  //console.log(body);
  let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
  let days = json['speiseplan']['tag'];
  console.log("XML" + json);
  return days;
}*/

async function getMeals(endPoint, dateMeal, i) {
  request(endPoint, async (error, response, body) => {
    let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
    let days = json['speiseplan']['tag'];


      let meals = days[i]['item'];
      for (let x = 0; x < meals.length; x++) {
        let languageCode = meals[x]['_attributes']['language'];
        let category = meals[x]['category']['_text'];
        let name = meals[x]['title']['_text'];
        let studentPrice = meals[x]['preis1']['_text'];
        let employeePrice = meals[x]['preis2']['_text'];


        await CanteenMeal.create({
          language: languageCode,
          category: category,
          title: name,
          studentPrice: studentPrice,
          employeePrice: employeePrice,
          onDate: dateMeal.id
        });
      }

  });


}


