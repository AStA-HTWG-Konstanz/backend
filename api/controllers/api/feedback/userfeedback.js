const moment = require('moment');

module.exports = {

  friendlyName: 'User Feedback',

  description: 'Gets Userfeedback and stores it in DB',

  inputs: {
    category: {
      description: 'Feedback Category (Bug, Feedback, etc.)',
      type: 'string',
      required: true,
      example: 'feddback'
    },

    os: {
      description: 'the operating System of the device',
      type: 'string',
      default: 'none',
      required: false,
      example: 'Ios 12.4'
    },

    message: {
      description: 'Message of the user',
      type: 'string',
      required: true,
      example: 'This is a cool app'
    }

  },
  exits: {
    success: {
      statusCode: 200,
      responseType: ''
    },

    failure: {
      statusCode: 400,
      responseType: ''
    }
  },

  fn: async function (inputs, exits) {
    await Feedback.create({category: inputs.category, os: inputs.os, message: inputs.message, date: moment.format('DD MM YYYY')});
  }

};
