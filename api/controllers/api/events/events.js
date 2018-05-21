module.exports = {

  friendlyName: 'Events',

  description: 'Provide events to the app.',

  inputs: {},

  exits: {
    success: {
      statusCode: 200
    },
    invalidRequest: {
      statusCode: 400
    },
    errorOccured: {
      statusCode: 500,
      responseType: ''
    }
  },

  fn: async function (inputs, exits) {

    Event.find({
      select: ['title', 'eventDate']
    }).then(function (data) {
      return exits.success({news: data});
    }).catch(function (error) {
      sails.log(error);
      return exits.errorOccured();
    });
  }
};
