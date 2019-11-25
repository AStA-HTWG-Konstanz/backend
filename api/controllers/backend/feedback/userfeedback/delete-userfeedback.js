module.exports = {

  friendlyName: 'Delete userfeedback',

  description: 'Provide action to delete userfeedback.',

  inputs: {},

  exits: {
    success: {
      statusCode: 200,
      responseType: ''
    },
    errorOccured: {
      statusCode: 500,
      responseType: ''
    }
  },

  fn: async function (inputs, exits) {
    UserFeedback.destroy({id: this.req.params.id}).then(function () {
      return exits.success();
    }).catch(function (error) {
      sails.log.error(error);
      return exits.errorOccured();
    });
  }
};
