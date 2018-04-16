let newsData = require('../../../../json/news');
module.exports = async function news(req, res) {
  return res.json (newsData);
};
