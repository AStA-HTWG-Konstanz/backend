let request = require('request');
let fs = require('fs');

module.exports = {


  friendlyName: 'Get LSF data',


  description: 'Fetches ical data from LSF and returns the result',


  inputs: {
    cookie: {
      type: 'string',
      description: 'Cookie for LSF login at HTWG Konstanz.',
      required: true
    }
  },


  exits: {
    success: {
      outputFriendlyName: 'Event data',
      outputDescription: 'Event data returned from LSF.'
    },
    errorOccured: {
      outputFriendlyName: 'Failed to fetch data',
      outputDescription: 'Fetching the event data was not possible.'
    },
    loginFailed: {
      outputFriendlyName: 'Failed to login',
      outputDescription: 'Failed to login with provided cookie.'
    },
  },


  fn: async function (inputs, exits) {
    let headers = {
      'cookie': inputs.cookie
    };

    request.get({
      url: sails.config.custom.datacenter.lsf.icalEndpoint,
      headers: headers
    }).pipe(fs.createWriteStream('/home/manuel/test.txt'));

  }
};
