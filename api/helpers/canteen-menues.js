module.exports = {

  friendlyName: 'canteen Menues Helper',


  description: 'get Menues from Seezeit Server',


  inputs: {

    languageCode: {
      type: 'string',
      example: 'en',
      description: 'meals language ',
      required: true
    }


  },

  exits: {
    success: {
      outputFriendlyName: '',
      outputDescription: ''
    }
  },
  fn: async function (inputs, exits) {

    if (inputs.languageCode === 'de') {
      return exits.success( sails.config.custom.seezeit.canteen.deEndpoint);
    } else {
      return exits.success( sails.config.custom.seezeit.canteen.enEndpoint);
    }
  }
};
