var express = require('express');
var router = express.Router();

var newsData = require('../../json/news');
var newsCategoriesData = require('../../json/newsCategories');

/* GET users listing. */
router.post('/:page/:elements', function (req, res, next) {
    res.json(newsData);
});

router.get('/categories', function (req, res, next) {
    res.json(newsCategoriesData);
});

module.exports = router;
