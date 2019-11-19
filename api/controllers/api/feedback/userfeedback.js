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
      required: false,
      example: 'Ios 12.4'
    },

    device: {
      description: 'device of the user',
      type: 'string',
      required: false,
      example: 'IPhone X'
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
    },

    errorOccured: {
      statusCode: 500,
      responseType: ''
    }
  },

  fn: async function (inputs, exits) {
    UserFeedback.create({
      category: inputs.category,
      os: inputs.os,
      device: inputs.device,
      message: inputs.message,
      date: moment().format('YYYY-MM-DD')
    }).then(() => {
      return exits.success();
    }).catch(error => {
      sails.log.error(error);
      return exits.failure();
    });
  }
};
