let request = require('request');
const cheerio = require('cheerio');
const util = require('util');
let key = 'dates';



module.exports = {

    friendlyName: 'Events',

    description: 'Loads events and saves them in redis',

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

    datesJob: async function (inputs, exits) {
        sails.log.info("starting dates job");
        request.get({
            url: sails.config.custom.events.urlopen,
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0'}
        }, async function (err, httpResponse, body) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            }

            try {
                const $ = cheerio.load(body);
                let output = {events: []};

                let examRegistrationPeriod = $("strong:contains(Prüfungsanmeldezeitraum)").text().replace(":", "");
                let examPeriods = $("strong:contains(Prüfungszeitraum)").text().split(":");
                let lectureStart = $("strong:contains(Vorlesungsbeginn)").text();
                let lectureEnd = $("strong:contains(Vorlesungsende)").text();

                let values = [examRegistrationPeriod, examPeriods[0], examPeriods[1], lectureStart, lectureEnd];

                let summerSemesterYear;
                let winterSemesterYears = [];

                if (examRegistrationPeriod.includes("Sommersemester")) {
                    summerSemesterYear = examRegistrationPeriod.substring(39, 43);

                    let dates = $("p:contains('" + summerSemesterYear + "')").text().split(":");

                    let i = 0;
                    for (i; i < 5; i++) {
                        let currentDate = dates[i + 1].trim();
                        let index = currentDate.indexOf(summerSemesterYear) + 4;
                        currentDate = currentDate.substring(0, index);
                        output.events.push({title: values[i], eventDate: currentDate});
                    }
                    await sails.getDatastore('cache').leaseConnection(async (db, proceed) => {
                        sails.log.info("try to save");
                        await (util.promisify(db.set).bind(db))(key, JSON.stringify(output));
                        return proceed();
                    });

                    sails.log.info('Dates saved successfully');

                } else if (examRegistrationPeriod.includes("Wintersemester")) {
                    let firstWinterSemesterYear = examRegistrationPeriod.substring(39, 43);
                    let secondWinterSemesterYear = firstWinterSemesterYear.substring(0, 2) + examRegistrationPeriod.substring(44, 46);
                    winterSemesterYears.push(firstWinterSemesterYear, secondWinterSemesterYear, secondWinterSemesterYear, firstWinterSemesterYear, secondWinterSemesterYear);

                    let dates = $("p:contains('" + firstWinterSemesterYear + "')").text().split(":");

                    let i = 0;
                    for (i; i < 5; i++) {
                        let currentDate = dates[i + 1].trim();
                        let index = currentDate.indexOf(winterSemesterYears[i]) + 4;
                        currentDate = currentDate.substring(0, index);
                        output.events.push({title: values[i], eventDate: currentDate});
                    }
                    await sails.getDatastore('cache').leaseConnection(async (db, proceed) => {
                        await (util.promisify(db.set).bind(db))(key, JSON.stringify(output));
                        return proceed();
                    });
                    sails.log.info('Dates saved successfully');

                } else {
                    sails.log.error("Events not found");
                    return exits.failure();
                }
            } catch (error) {
                sails.log.error(error);
                return exits.failure();
            }
        });
    }
};
