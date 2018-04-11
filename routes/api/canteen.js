var express = require('express');
var router = express.Router();

var jsonData = require('../../json/canteen');
/* GET users listing. */
router.get('/:language/menu', function(req, res, next) {
    res.json(jsonData);
});

module.exports = router;
