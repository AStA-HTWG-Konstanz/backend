/**
 * Feedback.js
 *
 * @description :: App feedback
 * **/


module.exports = {
  attributes: {
    date: {
      type: 'ref',
      columnType: 'date',
      required: true
    },

    category: {
      type: 'string',
      required: true
    },

    os: {
      type: 'string',
      required: false
    },

    message: {
      type: 'string',
      required: true
    }
  },
};
