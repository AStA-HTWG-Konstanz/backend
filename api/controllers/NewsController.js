/**
 * NewsController
 *
 * @description :: Actions to deliver news data.
 */
let newsData = require('../../json/news');
let newsCategories = require('../../json/newsCategories');

module.exports = {
    news: function (req, res) {
        res.json(newsData);
    },
    categories: function (req, res) {
        res.json(newsCategories)
    }
};
