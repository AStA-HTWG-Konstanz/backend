let request = require('request');
const cheerio = require('cheerio');

module.exports = {


    friendlyName: 'Get LSF pid id',


    description: 'Fetches pid id',


    inputs: {
        cookie: {
            type: 'string',
            description: 'Cookie for LSF login at HTWG Konstanz.',
            required: true
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Pid',
            outputDescription: 'Pid returned from LSF.'
        },
        errorOccured: {
            outputFriendlyName: 'Failed to fetch pid',
            outputDescription: 'Fetching the pid was not possible.'
        },
    },


    fn: async function (inputs, exits) {
        let headers = {
            'cookie': inputs.cookie
        };

        request.get({
            url: sails.config.custom.datacenter.lsf.pidPage,
            headers: headers
        }, function (err, httpResponse, body) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            }
            const $ = cheerio.load(body);
            let pidURL = $('#makronavigation > ul > li:nth-child(3) > a').attr('href');
            if (typeof pidURL === "undefined") {
                return exits.errorOccured();
            }
            const url = new URL(pidURL);
            let pid = url.searchParams.get('personal.pid');
            return exits.success({pid: pid});
        });
    }
};
