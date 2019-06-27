let request = require('request');
const util = require('util');
const cheerio = require('cheerio');


let key = 'strandbar';


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
        }, async function (err, httpResponse, body) {
            if (err) {
                return sails.log.error(err);
            }
            try {
                let data = JSON.parse(body);
                const $ = cheerio.load(data["collection"]["description"]);

                let open = $("strong").text();
                if (open === "geschlossen" || open === "Geschlossen") {
                    await sails.getDatastore('cache').leaseConnection(async (db, proceed) => {
                        await (util.promisify(db.set).bind(db))(key, JSON.stringify({open: "false"}));
                        return proceed();
                    });
                    sails.log.info("strandbar job successful");

                } else if (open === "geöffnet" || open === "Geöffnet") {
                    await sails.getDatastore('cache').leaseConnection(async (db, proceed) => {
                        await (util.promisify(db.set).bind(db))(key, JSON.stringify({open: "true"}))
                        return proceed();

                    });

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
