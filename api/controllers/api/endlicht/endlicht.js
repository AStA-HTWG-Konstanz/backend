let moment = require('moment');

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
            let output = {};
            output["endlicht"] = [];
            output["endlicht"].push({openingHours: [], specials: [], beverages: []});

            let hours = await EndlichtHours.find().catch(function (e) {
                sails.log.error(e);
                return exits.errorOccured();
            });

            if (hours) {
                for (let index in hours) {
                    let day = moment().isoWeekday(hours[index].weekday).format("DD-MM-YYYY");


                    if (hours[index].startTime.substr(0, 5) === "00:00") {
                        output["endlicht"][0]["openingHours"].push({
                            date: day,
                            startTime: "0",
                            endTime: "0",
                        });
                    } else {
                        output["endlicht"][0]["openingHours"].push({
                            date: day,
                            startTime: hours[index].startTime.substr(0, 5),
                            endTime: hours[index].endTime.substr(0, 5),
                        });

                    }
                }
            }

            let specials = await EndlichtBeverages.find({special: true}).catch(function (e) {
                sails.log.error(e);
                return exits.errorOccured()
            });
            if (specials) {
                for (let index in specials) {
                    output["endlicht"][0]["specials"].push({
                        name: specials[index].name,
                        price: specials[index].price
                    });
                }
            }

            let beverages = await EndlichtBeverages.find({special: false}).catch(function (e) {
                sails.log.error(e);
                return exits.errorOccured();
            });

            if (beverages) {
                for (let index in beverages) {
                    output["endlicht"][0]["beverages"].push({
                        name: beverages[index].name,
                        price: beverages[index].price
                    });

                }
            }
            return exits.success(output);
        } catch (e) {
            sails.log.error(e);
            return exits.errorOccured();
        }
    }
};
