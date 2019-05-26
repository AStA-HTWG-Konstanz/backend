let request = require('request');
const cheerio = require('cheerio');
const redis = require('redis');
client = redis.createClient(6379 / 1, 'localhost');

module.exports = {
    friendlyName: 'strandbar',

    description: 'checks if the strandbar is open and saves it to redis',

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
    strandbarJob: async function () {
        sails.log.info("starting strandbar job");

        request.get({
            url: sails.config.custom.strandbar.urlopen,
            headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0'}
        }, function (err, httpResponse, body) {
            if (err) {
                return sails.log.error(err);
            }
            try {
                const $ = cheerio.load(body);
                let open = $("strong:nth-child(1)").text();
                if (open === "Geschlossen") {
                    client.set('strandbar', false);
                    sails.log.info("strandbar job successful");

                } else if (open === "Geöffnet") {
                    client.set('strandbar', true);
                    sails.log.info("strandbar job successful");

                } else {
                    return sails.log.error("Strandbar job failed");

                }
            } catch (error) {
                return sails.log.error(error);

            }

        });

    }

};
