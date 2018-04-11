let LdapAuth = require('ldapauth-fork');
const config = require('../config')();

let authService = new LdapAuth(config.ldap);

module.exports = {
    /**
     * Function to authenticate user against LDAP-Server
     * @param username RZ-Username
     * @param password RZ-Password
     * @param callback error, result
     */
    login: function (username, password, callback) {
        authService.authenticate(username, password, function (err, userObject) {
            if (err) {
                console.log(err);
                callback("Error authentication against LDAP-Server failed.", null);
            }
            callback(null, userObject);
        });
    }
};
