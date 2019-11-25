/**
 * UserFeedback.js
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
      type: 'number',
      required: true
    },

    os: {
      type: 'string',
      required: false
    },

    device: {
      type: 'string',
      required: false
    },

    message: {
      type: 'string',
      required: true
    }
  },
};
