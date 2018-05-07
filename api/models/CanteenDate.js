module.exports = {

  attributes: {
    date: {
      type: 'ref',
      columnType: 'date',
      unique:   true

    },


    meals: {
      collection: 'CanteenMeal',
      via: 'onDate'
    }
  },

};
