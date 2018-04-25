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
    return exits.success(result);


 }
}

