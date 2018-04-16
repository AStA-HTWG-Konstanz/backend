let menuData = require('../../../../json/canteen');

module.exports = async function menu(req, res) {
    return res.json(menuData);
};