module.exports = {

  attributes: {
    date: {
      type: 'ref',
      columnType: 'datetime'
    },


    meals: {
      collection: 'CanteenMeal',
      via: 'onDate'
    }
  },
  findMenu: async function (opts) {
    let mealsOnDate = await CanteenDate.find().populate(onDate);

    if (!mealsOnDate) {
      let err = new Error(require('util').format('Cannnot find this Date'));
      err.code = 'E_UNKNOWN_Date';
      throw err;
    }
    return mealsOnDate;

  }
};
