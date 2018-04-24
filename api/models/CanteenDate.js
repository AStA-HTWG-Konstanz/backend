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
  }
}
