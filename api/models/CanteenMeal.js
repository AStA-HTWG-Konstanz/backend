module.exports = {

  attributes: {

    language: {
      type: 'String',
      required: true,
    },
    category: {
      type: 'String',
      required: true
    },
    title: {
      type: 'String',
      required: true
    },
    studentPrice: {
      type: 'number',
      required: true
    },
    employeePrice: {
      type: 'number',
      required: true
    },

    onDate: {
      model: 'CanteenDate'
    }


  }
  fn
};
