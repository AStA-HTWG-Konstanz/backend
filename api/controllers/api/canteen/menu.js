module.exports = {

  friendlyName: 'Menu',

  description: 'Provide menues to the app.',

  inputs: {},

  exits: {
    success: {
      statusCode: 200
    },
    errorOccured: {
      statusCode: 500,
      responseType: ''
    }
  },

  fn: async function (inputs, exits) {
    sails.helpers.canteenData(this.req.params.language);
  }
};
