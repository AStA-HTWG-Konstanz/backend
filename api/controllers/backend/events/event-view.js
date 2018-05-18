module.exports = {

  friendlyName: 'Event View',

  description: 'Provide events page.',

  inputs: {},

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/events'
    }
  },

  fn: async function (inputs, exits) {
    let title = await Event.find();
    let eventTitle;
    if (!title) {
      eventTitle = null;
    } else {
      eventTitle = title;
    }

    return exits.success({page: 'events', event: eventTitle});

  }
};
