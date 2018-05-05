module.exports = {

  friendlyName: 'Menu',

  description: 'Provide menues to the app.',

  inputs: {},

  exits: {
    success: {
      statusCode: 200
    },
    invalidRequest: {
      statusCode: 400
    },
    errorOccured: {
      statusCode: 500,
      responseType: ''
    }
  },

  fn: async function (inputs, exits) {
    let lang = this.req.params.language;
    if (lang === 'de') {
      findData('de',exits);
    } else {
      findData('en',exits);
    }

  }
};
let menuSQL = `
SELECT date, category, title, studentPrice, employeePrice
FROM canteenmeal cM INNER JOIN canteendate cD on cM.onDate = cD.ID
WHERE
  language = $1
  
`;

async function findData(lang,exits) {

    let menuResult = await sails.sendNativeQuery(menuSQL,[lang]);
    console.log(menuResult);

  return exits.success(menuResult);
  /* find({
     where:{language: lang },
     select: ['category', 'title', 'studentPrice', 'employeePrice']
   }).populate('onDate').select("date").then(function (data) {
     return exits.success({menu: data});
   }).catch(function (error) {
     sails.log(error);
     return exits.errorOccured();
   });*/
}
