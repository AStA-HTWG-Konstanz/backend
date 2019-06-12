let request = require('request');
var fs = require('fs');
const RequestQueue = require('node-request-queue');
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
        let rq = new RequestQueue(10);
        let request = request.get({
                url: inputs.url.replace("{asiToken}", inputs.asi),
                headers: headers,
                agentOptions: {
                    ca: fs.readFileSync('./assets/certificates/chain.pem')
                }
            }, rq.push(request),

            rq.on('resolved', res => {
                return exits.success(res);


            }).on('rejected', err => {
                sails.log.error(err);
                return exits.errorOccured();

            }).on('completed', () => {
            }))


        /*function (err, result, bodyData) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            }
            try {
                return exits.success(bodyData);
            } catch (e) {
                sails.log.error(e);
                return exits.errorOccured();
            }
        }*/


    }
};
