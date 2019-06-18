let LdapAuth = require('ldapauth-fork');

module.exports = {


    friendlyName: 'LDAP login',


    description: 'Performs authorization against an LDAP-Server',


    inputs: {
        username: {
            type: 'string',
            example: 'user1',
            description: 'Username for datacenter login at HTWG Konstanz.',
            required: true
        },
        password: {
            type: 'string',
            example: 'password1234',
            description: 'Password for datacenter login at HTWG Konstanz.',
            required: true
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'User data',
            outputDescription: 'Data about the user returned from the LDAP-Server.'
        },
        errorOccured: {
            outputFriendlyName: 'LDAP error',
            outputDescription: 'LDAP error authentication was not possible.'
        }
    },


    fn: async function (inputs, exits) {
        let authService = new LdapAuth(sails.config.custom.ldap);
        authService.authenticate(inputs.username, inputs.password, function (err, userObject) {
            if (err) {
                authService.close(function (error) {
                    if (error) {
                        sails.log.error(error);
                    }
                    return exits.errorOccured();
                });
            } else {
                authService.close(function (error) {
                    if (error) {
                        sails.log.error(error);
                    }
                    return exits.success(userObject);
                });
            }
        });
    }
};
