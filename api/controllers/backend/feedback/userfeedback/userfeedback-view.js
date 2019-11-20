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

  fn: async function(inputs, exits) {


    return exits.success({page: 'userfeedback'});
  }
};
