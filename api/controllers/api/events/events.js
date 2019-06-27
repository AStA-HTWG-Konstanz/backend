const redis = require('redis');
client = redis.createClient(6379 / 1, 'localhost');
const util = require('util');

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
            let value = await sails.getDatastore('cache').leaseConnection(async (db) =>{
                let found = await (util.promisify(db.get).bind(db))('dates');
                if (found === null){
                    sails.log.error('no dates entry in redis');
                    return exits.errorOccured();
                } else {
                    return exits.success(found);
                }
            });
        } catch (error) {
            sails.log.error(error);
            return exits.failure;
        }

    }
};
