const menuSQLAll = `
SELECT date, category, title, studentPrice, employeePrice
FROM canteenmeal cM INNER JOIN canteendate cD on cM.onDate = cD.ID
WHERE
  language = $1
order by date, cM.id
  
`;


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
    if (lang !== 'de' && lang !== 'en') {
      return exits.invalidRequest();
    }
    CanteenMeal.getDatastore().sendNativeQuery(menuSQLAll, [lang]).exec(function (err, rawResult) {
      if (err) {
        sails.log.error(err);
        return exits.errorOccured();
      } else {
        let output = {menu: []};
        let key;
        let index = 0;
        for (let row of rawResult.rows) {
          if (typeof key === 'undefined') {
            key = new Date(row['date']).toLocaleDateString();
            output.menu.push({date: key, meals: []});
          }

          if (key === new Date(row['date']).toLocaleDateString()) {
            output.menu[index].meals.push({
              ctgry: row['category'],
              title: row['title'],
              priceStud: row['studentPrice'],
              priceEmpl: row['employeePrice']
            });
          } else {
            key = new Date(row['date']).toLocaleDateString();
            index++;
            output.menu.push({date: key, meals: []});
            output.menu[index].meals.push({
              ctgry: row['category'],
              title: row['title'],
              priceStud: row['studentPrice'],
              priceEmpl: row['employeePrice']
            });
          }
        }
        return exits.success(output);
      }
    });
  }
};
