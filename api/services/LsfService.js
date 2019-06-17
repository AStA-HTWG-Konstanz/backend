let request = require('request');
const cheerio = require('cheerio');
let async = require('async');
const fs = require('fs');
let ical2json = require("ical2json");
let https = require('https');


let importLectures = function (callback) {
    var promises = [];

    for (courseIdx in sails.config.custom.datacenter.lsf.ids) {
        promises.push(new Promise(function (resolve, reject) {
            course = sails.config.custom.datacenter.lsf.ids[courseIdx];
            getUrl(course).then(function (courseObj) {
                return downloadICal(courseObj.icalURL, courseObj.course);
            }).then(function (courseObj) {
                return readIcalAndParse(courseObj);
            }).then(function (parsedEvents) {
                return writeToDatabase(parsedEvents);
            }).then(function () {
                resolve();
            }).catch(function (err) {
                sails.log.error(err)
                resolve();
            });
        }));
    };
    Promise.all(promises).then(function () {
        callback();
    });
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function getUrl(course) {
    return new Promise(function (resolve, reject) {
        let url = sails.config.custom.datacenter.lsf.icalPage.replace("${id}", course.id);
        request.get({
            url: url,
            agentOptions: {
                ca: fs.readFileSync('./assets/certificates/chain.pem')
            }
        }, function (err, res, body) {
            if (err) {
                reject(err);
            }

            const $ = cheerio.load(body);
            let icalURL = $('#wrapper > div.divcontent > div.content_max > form > table:nth-child(3) > tbody > tr > td:nth-child(1) > a').attr('href');

            if (typeof icalURL === "undefined") {
                reject("Failed to get URL for: " + course.name);
            } else {
                resolve({ icalURL: icalURL, course: course });
            }
        });
    });
}

function downloadICal(icalURL, course) {
    return new Promise(function (resolve, reject) {
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
                fs.unlink(sails.config.appPath + '/.tmp/ical/' + course.id + '.ics', function(){}); // Delete the file async. (But we don't check the result)
                reject(err);
            }
            fs.writeFile(sails.config.appPath + '/.tmp/ical/' + course.id + '.ics', body, function (err) {
                if (err) {
                    reject(err);
                }
                sails.log("The file for course: " + course.id + " was saved!");
                resolve(course);
            });
        });
    });
}

function readIcalAndParse(course) {
    return new Promise(function (resolve, reject) {
        /**
         * Read iCal file from disk an pass it to the parser
         */
        const ics = fs.readFileSync(sails.config.appPath + '/.tmp/ical/' + course.id + '.ics', 'utf-8');
        var input = ics.replace(/\r\n/g, ",");
        sails.helpers.icalParser(input).then((parsedEvents) => {
            resolve(parsedEvents);
        }).catch(function (error) {
            reject(error);
        });
    });
}

function writeToDatabase(parsedEvents) {
    var promises = [];
    return new Promise(function (resolve, reject) {
        for (eventIdx in parsedEvents.events) {
            promises.push(new Promise(function (resolve, reject) {
                event = parsedEvents.events[eventIdx];
                lexturesToDatabase(event).then(function (eventObj) {
                    return dataToDatabase(eventObj.event, eventObj.id);
                }).then(function () {
                    resolve();
                }).catch(function (err) {
                    sails.log(err);
                    resolve();
                });
            }));
        };
        Promise.all(promises)
            .then(function () {
                resolve()
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

function lexturesToDatabase(event) {
    /**
     * Write lectures to database
     */
    return new Promise(function (resolve, reject) {
        LsfLectures.create({
            lsfID: event.lsfID,
            lsfCourseID: event.lsfCourseID,
            name: event.name,
            startTime: event.startTime,
            endTime: event.endTime,
            room: event.room,
            category: event.category
        }).fetch().then(function (createdEvent) {
            resolve({event: event, id: createdEvent.id});
        }).catch(function (error) {
            reject(error);
        });
    })
}

function dataToDatabase(event, lectureID) {
    /**
    * Write dates for lecture to database
    */
    var promises = [];
    return new Promise(function (resolve, reject) {
        for (dateIdx in event.dates) {
            promises.push(new Promise(function (resolve, reject) {
                date = event.dates[dateIdx];
                LsfLectureDates.create({ lectureDate: date, lecture: lectureID }).then(function () {
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            }));
        };
        Promise.all(promises)
            .then(function () {
                resolve()
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

module.exports = {
    importLectures: importLectures
};
