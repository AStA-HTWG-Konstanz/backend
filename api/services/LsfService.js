let importLectures = function (callback) {
    sails.log.debug("Hi im the job!");
    callback();
};

module.exports = {
  importLectures: importLectures
};
