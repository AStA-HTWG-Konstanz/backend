module.exports = {

    friendlyName: 'Endlicht',

    description: 'Endlicht specials, opening hours and beverages.',

    inputs: {},

    exits: {
        success: {
            statusCode: 200
        },
        errorOccured: {
            statusCode: 500,
        }
    },

    fn: async function (inputs, exits) {
        try {
            let output = {endlicht: {}};
            let hours = await EndlichtHours.find().catch(function (e) {
                return exits.errorOccured();
            });
            output.endlicht["openingHours"] = {};
            if (hours) {
                for (let index in hours) {
                    output.endlicht["openingHours"][hours[index].weekday] = {};
                    output.endlicht["openingHours"][hours[index].weekday]["startTime"] = hours[index].startTime.substr(0, 5);
                    output.endlicht["openingHours"][hours[index].weekday]["endTime"] = hours[index].endTime.substr(0, 5);
                }
            }

            let special = await EndlichtBeverages.findOne({special: true}).catch(function (e) {
                sails.log.error(e);
                return exits.errorOccured()
            });
            output.endlicht["special"] = {};
            if (special) {
                output.endlicht["special"]["name"] = special.name;
                output.endlicht["special"]["price"] = special.price;
            }

            let beverages = await EndlichtBeverages.find({special: false}).catch(function (e) {
                sails.log.error(e);
                return exits.errorOccured();
            });
            output.endlicht["beverages"] = [];
            if (beverages) {
                for (let index in beverages) {
                    output.endlicht["beverages"].push({name: beverages[index].name, price: beverages[index].price});
                }
            }
            return exits.success(output);
        } catch (e) {
            sails.log.error(e);
            return exits.errorOccured();
        }
    }
};
