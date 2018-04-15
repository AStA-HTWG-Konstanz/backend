/**
 * CanteenController
 *
 * @description :: Actions to deliver menu data.
 */
let menuData = require('../../json/canteen');

module.exports = {
    menu: function (req, res) {
        res.json(menuData)
    }
};
