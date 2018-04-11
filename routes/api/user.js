var express = require('express');
var router = express.Router();
var LdapAuth = require('ldapauth-fork');

var options = {
    url: 'ldaps://ldap-01.htwg-konstanz.de:636',
    searchBase: 'ou=users,dc=fh-konstanz,dc=de',
    searchFilter: 'uid={{username}}',
    rejectUnauthorized: false
};

var auth = new LdapAuth(options);


router.post('/auth', function (req, res, next) {
    var username = req.body.username;
    var passwort = req.body.psw;

    auth.on('error', function (err) {
        console.log(err);
    });

    auth.authenticate(username, passwort, function(err, user) {
        if (err){
            res.send(err);
        }
        res.send(user);
    });


});


module.exports = router;


