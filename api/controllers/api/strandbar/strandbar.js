const jsdom = require("jsdom");
const {JSDOM} = jsdom;
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.DOMParser = new JSDOM().window.DOMParser;

module.exports = {
  friendlyName: 'strandbar',

  description: 'checks if the strandbar is open',

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
    const HTTP = new XMLHttpRequest();
    HTTP.open("GET", sails.config.custom.strandbar.urlopen);
    HTTP.send();
    HTTP.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(HTTP.responseText);
        if (response.collection.description.includes("Geöffnet")) {
          return exits.success({open: true});
        }
      }
    }

  }


};
