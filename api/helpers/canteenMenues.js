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
  fn: async function (req, exits) {
    var result = req.language;
    if (result === 'de') {
      result = Sails.config.custom.seezeit.canteen.deEndpoint;
    } else {
      result = Sails.config.custom.seezeit.canteen.enEndpoint;
    }

    return exits.success(result);


  }
};

