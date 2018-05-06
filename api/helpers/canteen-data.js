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
    let dateMeal = createDate();
    getMeals(sails.config.custom.seezeit.canteen.deEndpoint, dateMeal);
    getMeals(sails.config.custom.seezeit.canteen.enEndpoint, dateMeal);
  }
};

async function createDate() {
  request(sails.config.custom.seezeit.canteen.deEndpoint, async (error, response, body) => {
    let days = parseXML(body);
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
      console.log(dateMeal);
      return dateMeal;

    }
  });
}

async function parseXML(body) {
  let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}));
  let days = json['speiseplan']['tag'];
  console.log(days);
  return days;
}

async function getMeals(endPoint, dateMeal) {
  request(endPoint, async (error, response, body) => {
    let days = parseXML(body);

    for (let i = 0; i < days.length; i++) {
      let meals = days[i]['item'];
      for (let x = 0; x < meals.length; x++) {
        let languageCode = meals[x]['_attributes']['language'];
        let category = meals[x]['category']['_text'];
        let name = meals[x]['title']['_text'];
        let studentPrice = meals[x]['preis1']['_text'];
        let employeePrice = meals[x]['preis2']['_text'];

        console.log("language" + languageCode);
        console.log(name);
        console.log(category);

        await CanteenMeal.create({
          language: languageCode,
          category: category,
          title: name,
          studentPrice: studentPrice,
          employeePrice: employeePrice,
          onDate: dateMeal.id
        });
      }

    }
  });


}


