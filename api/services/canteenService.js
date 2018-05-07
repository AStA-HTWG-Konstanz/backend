

let importMenus = function (callback) {
  sails.helpers.canteenData().then(function () {
    callback();
  }).catch(function (error) {
    callback(error);
  });
};

module.exports = {
    importMenus: importMenus
};
