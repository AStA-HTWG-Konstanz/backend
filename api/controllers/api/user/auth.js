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
      if(checkForUserroleStudent(user)){
        return exits.success({"student" : "true"});
      } else {
        return exits.success({"student" : "false"});
      }
    }).catch(function (error) {
      sails.log.error(error);
      return exits.failure();
    });
  }
};

function checkForUserroleStudent(user){
  for(let i = 0;i <= user.objectClass.length; i++){
    if (user.objectClass[i] === 'FHKNSTUDENT'){
      return true;
    }
  }
  return false;
}
