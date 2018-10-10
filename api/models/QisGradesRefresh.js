/**
 * QisGradesRefresh.js
 *
 * @description :: Qis latest refresh dates
 */

module.exports = {

    attributes: {
        token: {
            type: 'string',
            required: true
        },
        lastRefreshDate: {
            type: 'ref',
            columnType: 'date'
        }
    }
};
