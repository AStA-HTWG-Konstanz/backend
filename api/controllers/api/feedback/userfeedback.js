const moment = require('moment');

module.exports = {

  friendlyName: 'User Feedback',

  description: 'Gets Userfeedback and stores it in DB',

  inputs: {
    category: {
      description: 'Feedback Category (Bug, Feedback, etc.)',
      type: 'number',
      required: true,
      example: 0
    },

    os: {
      description: 'the operating System of the device',
      type: 'string',
      required: false,
      example: 'Android 10.0'
    },

    device: {
      description: 'device of the user',
      type: 'string',
      required: false,
      example: 'Huawei P30 Pro'
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
