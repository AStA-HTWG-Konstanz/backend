let request = require('request');
const cheerio = require('cheerio');
const {URL} = require('url');
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
            url: sails.config.custom.datacenter.qisserver.graduationOverview.replace("{asiToken}", inputs.asi),
            headers: headers
        }, function (err, result, bodyData) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            }
            let bachelor = false;
            let master = false;
            const $ = cheerio.load(bodyData);
            try {
                //check first link for bachelor or master
                let graduationURL = $('#wrapper > div.divcontent > div.content > form > ul > li:nth-child(1) > a:nth-child(3)').attr("href");
                let graduationNumber = new URL(graduationURL).searchParams.get("nodeID").split("=")[1];
                if (graduationNumber === "84") {
                    bachelor = true;
                } else if (graduationNumber === "90") {
                    master = true;
                }
            } catch (e) {
                sails.log.error(e);
                //ignore error
            }
            try {
                //check if second link exists and for master
                let url = $('#wrapper > div.divcontent > div.content > form > ul > li:nth-child(2) > a:nth-child(3)').attr("href");
                let number = new URL(url).searchParams.get("nodeID").split("=")[1];
                if (number === "90") {
                    master = true;
                }
            } catch (e) {
                sails.log.error(e);
                //ignore error
            }
            return exits.success({bachelor: bachelor, master: master});
        });
    }
};
