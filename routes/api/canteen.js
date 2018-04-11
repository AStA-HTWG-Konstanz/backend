var express = require('express');
var router = express.Router();

var canteenData = require('../../json/canteen');
/* GET users listing. */
router.get('/:language/menu', function (req, res, next) {
    res.json(canteenData);
});

module.exports = router;
