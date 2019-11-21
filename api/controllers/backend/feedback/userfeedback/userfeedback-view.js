module.exports = {

  friendlyName: 'Userfeedback View',

  description: 'Provide endlicht page.',

  inputs: {},

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/userfeedback'
    }
  },

  fn: function (inputs, exits) {
    UserFeedback.find()
      .then(function (feedback) {
        return exits.success({page: 'userfeedback', feedbackData: feedback});
      })
      .catch(error => {
        sails.log.error(error);
        return exits.failure();
      });


  }
};
