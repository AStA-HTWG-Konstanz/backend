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

    let endPoint = await sails.helpers.canteenMenues({
      languageCode: inputs.languageCode
    });

  }
};
