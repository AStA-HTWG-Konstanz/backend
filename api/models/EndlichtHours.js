/**
 * EndlichtHours.js
 *
 * @description :: Endlicht opening hours
 */

module.exports = {
    attributes: {
        weekday: {
            type: 'string',
            required: true
        },
        startTime: {
            type: 'ref',
            columnType: 'time'
        },
        endTime: {
            type: 'ref',
            columnType: 'time'
        }
    }
};
