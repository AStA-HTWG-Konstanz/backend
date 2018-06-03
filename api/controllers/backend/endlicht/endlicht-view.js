module.exports = {

    friendlyName: 'Endlicht View',

    description: 'Provide endlicht page.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/endlicht'
        }
    },

    fn: async function (inputs, exits) {
        let beverages = await EndlichtBeverages.find();
        let beverageData;
        if (!beverages) {
            beverageData = null;
        } else {
            beverageData = beverages;
        }

        let endlichtHours = await EndlichtHours.find();
        let hourData;
        if (!endlichtHours) {
            hourData = null;
        } else {
            hourData = endlichtHours;
        }

        return exits.success({page: 'endlicht', beverages: beverageData, openingHours: hourData});
    }
};
