let request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');
const {URL} = require('url');
var RateLimiter = require('request-rate-limiter');



var limiter = new RateLimiter({
    rate: 10,
    interval: 60,
    backoffCode: 429,
    backoffTime: 10,
    maxWaitingTime: 40
});
module.exports = {


    friendlyName: 'Get qisserver asi code',


    description: 'Fetches asi code from qisserver and returns it',


    inputs: {
        cookie: {
            type: 'string',
            required: true,
            description: 'Qisserver cookie'
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'asi data',
            outputDescription: 'Asi returned from qisserver.'
        },
        errorOccured: {
            outputFriendlyName: 'Failed to fetch data',
            outputDescription: 'Fetching the asi data was not possible.'
        }
    },


    fn: async function (inputs, exits) {
        let headers = {
            'cookie': inputs.cookie
        };

        limiter.request().then(function (backoff) {
            request({
                method: 'GET',
                url: sails.config.custom.datacenter.qisserver.overviewPage,
                headers: headers,
                agentOptions: {
                    ca: fs.readFileSync('./assets/certificates/chain.pem')
                }

            }, function (err, response, body) {
                if (err) {
                    callback(err);
                } else if (response.statusCode === 429) {
                    sails.log.info('too many requests');
                    backoff();
                } else {
                    try {
                        const $ = cheerio.load(body);
                        let qissUrl = $('#wrapper > div.divcontent > div.content_max_portal_qis > div > form > div > ul > li:nth-child(4) > a').attr("href");
                        let asiCode = new URL(qissUrl).searchParams.get("asi");
                        return exits.success(asiCode);
                    } catch (e) {
                        sails.log.error(e);
                        return exits.errorOccured();
                    }
                }
            });

        }).catch(function (err) {
            sails.log.error(err);
            return exits.error();

        })

    }
};
