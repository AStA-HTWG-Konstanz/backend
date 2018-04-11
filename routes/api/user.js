var express = require('express');
var router = express.Router();

router.post('/auth', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.psw;

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
