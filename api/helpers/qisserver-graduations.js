let request = require('request');
const cheerio = require('cheerio');
const { URL } = require('url');
module.exports = {


    friendlyName: 'Get qisserver graduations',


    description: 'Fetches graduations from qisserver and returns it',


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
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'graduation data',
            outputDescription: 'Graduations returned from qisserver.'
        },
        errorOccured: {
            outputFriendlyName: 'Failed to fetch data',
            outputDescription: 'Fetching the graduation data was not possible.'
        }
    },


    fn: async function (inputs, exits) {
        let headers = {
            'cookie': inputs.cookie
        };
        request.get({
            //TODO: set url to graduate page
            url: sails.config.custom.datacenter.qisserver.overviewPage,
            headers: headers
        }, function (err, result, bodyData) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            }
            try {
                //TODO: check available graduations
                const $ = cheerio.load(bodyData);
                let qissUrl = $('#wrapper > div.divcontent > div.content_max_portal_qis > div > form > div > ul > li:nth-child(6) > a').attr("href");
                return exits.success(asiCode);
            } catch(e) {
                sails.log.error(e);
                return exits.errorOccured();
            }
        });
    }
};
