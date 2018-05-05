

let importMenus = async function (inputs, exits) {
  await sails.helpers.canteenData();
  return exits.success();
};

module.exports = {
    importMenus: importMenus
};
