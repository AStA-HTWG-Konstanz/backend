/**
 * CanteenController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let menuData = require('../../json/canteen');

module.exports = {
    menu: function (req, res) {
        res.json(menuData)
    }
};
