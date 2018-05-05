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
let menuSQLAll = `
SELECT date, category, title, studentPrice, employeePrice
FROM canteenmeal cM INNER JOIN canteendate cD on cM.onDate = cD.ID
WHERE
  language = $1
  
`;
let dateSQL = 'select date from canteendate';

async function findData(lang,exits) {

  let menus = {
    "menu" : await sails.sendNativeQuery(menuSQLAll,[lang])
  }

  let datedMenu = {
    "menu" : [
      {
        "menudate" : await sails.sendNativeQuery(dateSQL),
        "meals" :[
          {}
        ]
      }
    ]
  }

console.log(datedMenu["menu"]);
/*

for (let j = 0; j = datedMenu.menu.length; j++) {
  for (let i = 0; i = menus.menu.length(); i++) {
    if(datedMenu.menu[j].date == menus.menu[i].date){

    }

  }
*/



return exits.success(datedMenu);
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

