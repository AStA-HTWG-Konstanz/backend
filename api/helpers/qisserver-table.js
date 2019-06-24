let request = require('request');
const fs = require('fs');

const RateLimiter = require('request-rate-limiter');



const limiter = new RateLimiter({
    rate: 10,
    interval: 60,
    backoffCode: 429,
    backoffTime: 10,
    maxWaitingTime: 40
});
module.exports = {


    friendlyName: 'Get qisserver cookie',


    description: 'Fetches login cookie from qisserver and returns it',


    inputs: {
        cookie: {
            type: 'string',
            required: true,
            description: 'Qisserver cookie'
        },
        asi: {
            type: 'string',
            required: true,
            description: 'Qisserver asi code'
        },
        url: {
            type: 'string',
            required: true,
            description: 'Qisserver link'
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Table data',
            outputDescription: 'Grade table returned from qisserver.'
        },
        errorOccured: {
            outputFriendlyName: 'Failed to fetch data',
            outputDescription: 'Fetching the grade data was not possible.'
        }
    },


    fn: async function (inputs, exits) {
        let headers = {
            'cookie': inputs.cookie
        };

        limiter.request().then(function (backoff) {
            request({
                method: 'GET',
                url: inputs.url.replace("{asiToken}", inputs.asi),
                headers: headers,
                agentOptions: {
                    ca: fs.readFileSync('./assets/certificates/chain.pem')

                }

            }, function (err, respose, body) {
                if (err) {
                    callback(err);
                } else if (respose.statusCode === 429) {
                    sails.log.info('too many requests');
                    backoff();
                } else {
                    return exits.success(body);
                }

            });

        }).catch(function (err) {
            sails.log.error(err);
            return exits.error();

        })

    }
};

