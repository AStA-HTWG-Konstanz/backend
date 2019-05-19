let request = require('request');
const cheerio = require('cheerio');
var util = require('util');

module.exports = {
    friendlyName: 'strandbar',

    description: 'checks if the strandbar is open',

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

        request.get({
            url: sails.config.custom.strandbar.urlopen,
            headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0'}
        }, function (err, httpResponse, body) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            }
            try {
                const $ = cheerio.load(body);
                let open = $("strong:nth-child(1)").text();
                if (open === "Geschlossen") {
                    sails.getDatastore('redisCache').leaseConnection(async (db) => {
                        await (util.promisify(db.setex).bind(db))('strandbar', ttlInSeconds, 'false')
                    });
                    return exits.success();//({open: false});
                } else if (open === "Geöffnet") {
                    sails.getDatastore('redisCache').leaseConnection(async (db) => {
                        await (util.promisify(db.setex).bind(db))('strandbar', ttlInSeconds, 'true')
                    });
                    return exits.success();//({open: true});
                } else {
                    sails.log.error("Strandbar - element not found");
                    return exits.failure();
                }
            } catch (error) {
                sails.log.error(error);
                return exits.failure();
            }

        });

    }

};
