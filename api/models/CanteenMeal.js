module.exports = {

  attributes: {

    language: {
      type: 'string',
      required: true,
    },
    category: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string',
      required: true
    },
    studentPrice: {
      type: 'string',
      required: true
    },
    employeePrice: {
      type: 'string',
      required: true
    },

    onDate: {
      model: 'CanteenDate'
    }

  }
};
