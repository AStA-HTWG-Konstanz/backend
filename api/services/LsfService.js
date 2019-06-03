let request = require('request');
const cheerio = require('cheerio');
let async = require('async');
const fs = require('fs');
let ical2json = require("ical2json");
let https = require('https');


let importLectures = function (callback) {
    async.forEachOfSeries(sails.config.custom.datacenter.lsf.ids, function (course, key, cb) {
        async.waterfall([
            function (clbk) {
                /**
                 * Generate URL to iCal Page
                 */
                let url = sails.config.custom.datacenter.lsf.icalPage.replace("${id}", course.id);
                clbk(null, url);
            },
            function (url, clbk) {
                /**
                 * Get iCal URL from Page
                 */
                request.get({
                    url: url,
                    agentOptions: {
                        ca: fs.readFileSync('./assets/certificates/chain.pem')
                    }
                }, function (err, res, body) {
                    if (err) {
                        clbk(err, null);
                    }

                    const $ = cheerio.load(body);
                    let icalURL = $('#wrapper > div.divcontent > div.content_max > form > table:nth-child(3) > tbody > tr > td:nth-child(1) > a').attr('href');
                    clbk(null, icalURL);
                });
            },
            function (icalURL, clbk) {
                /**
                 * Check if we could get an URL
                 */
                if (typeof icalURL === "undefined") {
                    clbk("Failed to get URL for: " + course.name, null);
                } else {
                    clbk(null, icalURL);
                }
            },
            function (icalURL, clbk) {
                /**
                 * Download the iCal file
                 */
                var dir = sails.config.appPath + '/.tmp/ical/';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                request.get({
                    url: icalURL,
                    agentOptions: {
                        ca: fs.readFileSync('./assets/certificates/chain.pem')
                    }
                }, function (err, response, body) {
                    if (err) {
                        fs.unlink(sails.config.appPath + '/.tmp/ical/' + course.id + '.ics'); // Delete the file async. (But we don't check the result)
                        clbk(err);
                    }
                    fs.writeFile(sails.config.appPath + '/.tmp/ical/' + course.id + '.ics', body, function (err) {
                        if (err) {
                            return sails.log(err);
                        }

                        sails.log("The file was saved!");
                        clbk();
                    });
                });
            },
            function (clbk) {
                /**
                 * Read iCal file from disk an pass it to the parser
                 */
                const ics = fs.readFileSync(sails.config.appPath + '/.tmp/ical/' + course.id + '.ics', 'utf-8');
                var input = ics.replace(/\r\n/g, ",");
                sails.helpers.icalParser(input).then((parsedEvents) => {
                    clbk(null, parsedEvents);
                }).catch(function (error) {
                    clbk(error);
                });
            },
            function (parsedEvents, clbk) {
                /**
                 * Write all parsed events/lectures into the database
                 */
                async.forEachOf(parsedEvents.events, function (event, k, ck) {
                    async.waterfall([
                        function (c) {
                            /**
                             * Write lectures to database
                             */
                            LsfLectures.create({
                                lsfID: event.lsfID,
                                lsfCourseID: event.lsfCourseID,
                                name: event.name,
                                startTime: event.startTime,
                                endTime: event.endTime,
                                room: event.room,
                                category: event.category
                            }).fetch().then(function (createdEvent) {
                                c(null, createdEvent.id);
                            }).catch(function (error) {
                                c(error);
                            });
                        },
                        function (lectureID, c) {
                            /**
                             * Write dates for lecture to database
                             */
                            async.forEachOf(event.dates, function (date, ky, cb) {
                                LsfLectureDates.create({ lectureDate: date, lecture: lectureID }).then(function () {
                                    cb();
                                }).catch(function (error) {
                                    cb(error);
                                });
                            }, function (er) {
                                if (er) {
                                    c(er);
                                } else {
                                    // Execute callback of date async.forEachOf
                                    c();
                                }
                            });
                        }
                    ], function (e, r) {
                        if (e) {
                            ck(e);
                        } else {
                            // Execute callback of event async.forEachOf
                            ck();
                        }
                    });
                }, function (er) {
                    if (er) {
                        clbk(er);
                    }
                    clbk();
                });
            }
        ], function (error, result) {
            if (error) {
                sails.log.error(error);
                cb();
            } else {
                //Execute callback of async.forEachOfSeries
                cb();
            }
        });
    }, function (err) {
        if (err) {
            sails.log.error(err);
        } else {
            //Execute callback of importLectures
            callback();
        }

    });
};

module.exports = {
    importLectures: importLectures
};
