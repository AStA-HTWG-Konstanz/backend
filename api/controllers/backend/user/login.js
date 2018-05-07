module.exports = {

  friendlyName: 'Login user',

  description: 'Provide page to login.',

  inputs: {
    username: {
      type: 'string',
      example: 'user1',
      description: 'Username for datacenter login at HTWG Konstanz.'
    },
    password: {
      type: 'string',
      example: 'password1234',
      description: 'Password for datacenter login at HTWG Konstanz.'
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    },
    emptyParameters: {
      responseType: 'view',
      viewTemplatePath: 'pages/login'
    },
    errorOccured: {
      responseType: 'view',
      viewTemplatePath: 'pages/login'
    }
  },

  fn: async function (inputs, exits) {
    if (inputs.username === '' || inputs.password === '') {
      return exits.emptyParameters({errorMessage: 'Username/Password can\'t be empty.'});
    }
    let username = inputs.username;
    let password = inputs.password;

    sails.helpers.ldapLogin(username, password).then((user) => {
      BackendUser.findUser({username: user['uid']}).then((backendUser) => {
        this.req.session.username = user['uid'];
        this.req.session.name = user['cn'];
        if (backendUser.admin) {
          this.req.session.role = 'admin';
        } else {
          this.req.session.role = 'editor';
        }
        return exits.success('/');
      }).catch(function (error) {
        sails.log(error);
        return exits.errorOccured({errorMessage: 'You don\'t have enough rights to login.'});
      });
    }).catch(function (error) {
      return exits.errorOccured({errorMessage: 'Login failed. Please check your Username/Password or try again later.'});
    });
  }
};
