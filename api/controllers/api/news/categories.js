let newsCategories = require('../../../../json/newsCategories');
module.exports = async function categories(req, res) {
  return res.json(newsCategories);
};
