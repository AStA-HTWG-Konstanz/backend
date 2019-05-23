const util = require('util');
const redis = require('redis');
client = redis.createClient(6379 / 1, 'localhost');

module.exports = {
    friendlyName: 'strandbar',

    description: 'gets the open status of the strandbar from redis',

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
            client.get('strandbar', function (error, value) {
                if (error) {
                    sails.log.error(error);
                    return exits.failure;
                } else {
                    return exits.success({open: value});
                }
            })
        } catch (error) {
            sails.log.error(error);
            return exits.failure;
        }
    }

};
