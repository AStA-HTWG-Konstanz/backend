/**
 * NewsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
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
