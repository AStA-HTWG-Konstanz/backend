module.exports = {

  friendlyName: 'News',

  description: 'Provide news to the app.',

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
    if (!isFinite(String(this.req.params.elements)) || !isFinite(String(this.req.params.page))) {
      return exits.invalidRequest();
    }
    News.find({
      limit: this.req.params.elements,
      skip: this.req.params.page * this.req.params.elements,
      select: ['title', 'short_desc', 'content', 'category']
    }).then(function (data) {
      return exits.success({news: data});
    }).catch(function (error) {
      sails.log(error);
      return exits.errorOccured();
    });
  }
};
