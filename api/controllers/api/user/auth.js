module.exports = {

  friendlyName: 'LDAP Auth',

  description: 'LDAP-User authentication',

  inputs: {
    username: {
      type: 'string',
      required: true,
      example: 'user1',
      description: 'Username for datacenter login at HTWG Konstanz.'
    },
    password: {
      type: 'string',
      required: true,
      example: 'password1234',
      description: 'Password for datacenter login at HTWG Konstanz.'
    }
  },

  exits: {
    success: {
      statusCode: 200,
      responseType: ''
    },
    failure: {
      statusCode: 400,
      responseType: ''
    }
  },

  fn: async function (inputs, exits) {
    let username = inputs.username;
    let password = inputs.password;

    sails.helpers.ldapLogin(username, password).then((user) => {
      this.req.session.APIlogged = true;
      this.req.session.APIusername = username;
      return exits.success();
    }).catch(function (error) {
      sails.log.error(error);
      return exits.failure();
    });


  }

};
