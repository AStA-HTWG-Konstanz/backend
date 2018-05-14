/**
 * EndlichtBeverages.js
 *
 * @description :: Endlich beverages
 */

module.exports = {
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        price: {
            type: 'number',
            required: true
        },
        special: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};
