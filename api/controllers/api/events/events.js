const redis = require('redis');
client = redis.createClient(6379 / 1, 'localhost');

module.exports = {

    friendlyName: 'Events',

    description: 'Load events to the app from redis',

    inputs: {},

    exits: {
        success: {
            statusCode: 200
        },
        invalidRequest: {
            statusCode: 400
        },
        errorOccured: {
            statusCode: 500,
            responseType: ''
        }
    },

    fn: async function (inputs, exits) {
        try {
            client.get('dates', function (error, value) {
                if (error) {
                    sails.log.error(error);
                    return exits.failure;
                } else {
                    return exits.success(value);
                }
            })
        } catch (error) {
            sails.log.error(error);
            return exits.failure;
        }

    }
};
