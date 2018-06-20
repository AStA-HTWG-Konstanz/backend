let request = require('request');
const cheerio = require('cheerio');
const { URL } = require('url');
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
        request.get({
            url: sails.config.custom.datacenter.qisserver.overviewPage,
            headers: headers
        }, function (err, result, bodyData) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            }
            try {
                const $ = cheerio.load(bodyData);
                let qissUrl = $('#wrapper > div.divcontent > div.content_max_portal_qis > div > form > div > ul > li:nth-child(4) > a').attr("href");
                let asiCode = new URL(qissUrl).searchParams.get("asi");
                return exits.success(asiCode);
            } catch(e) {
                sails.log.error(e);
                return exits.errorOccured();
            }
        });
    }
};
