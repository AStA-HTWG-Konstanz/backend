/**
 * EndlichtBeverages.js
 *
 * @description :: Endlicht beverages
 */

module.exports = {
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        price: {
            type: 'string',
            required: true
        },
        special: {
            type: 'boolean',
            defaultsTo: false
        }
    },
    alreadyExists: async function (opts) {
        let beverage = await EndlichtBeverages.findOne({name: opts.name});
        if (!beverage) {
            throw new Error("Cannot find Beverage.");
        }
        return true;
    }
};
