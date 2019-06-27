const key = 'strandbar';
const util = require('util');

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
            let value = await sails.getDatastore('cache').leaseConnection(async (db) =>{
                let found = await (util.promisify(db.get).bind(db))(key);
                if (found === null){
                    sails.log.error('no strandbar entry in redis');
                    return exits.errorOccured();
                } else {
                    return exits.success(found);
                }
            });
        } catch(error) {
            sails.log.error(error);
            return exits.errorOccured();
        }
    }

};
