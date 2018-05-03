module.exports = {

  attributes: {
    date: {
      type: 'ref',
      columnType: 'date'
    },


    meals: {
      collection: 'CanteenMeal',
      via: 'onDate'
    }
  },

};
