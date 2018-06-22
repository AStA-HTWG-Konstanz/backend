let request = require('request');
const cheerio = require('cheerio');
const {URL} = require('url');
const LSF_LECTURES_FOR_USER_SQL = "SELECT name, startTime, endTime, room, category, lectureDate FROM lsflectures INNER JOIN lsflecturedates ON lsflectures.id = lsflecturedates.lecture WHERE lsfID IN ($1) AND lectureDate BETWEEN  CAST($2 AS DATE) AND CAST($3 AS DATE) ORDER BY lectureDate, startTime;";
module.exports = {

    friendlyName: 'Lectures',

    description: 'User lecture data',

    inputs: {
        username: {
            type: 'string',
            required: true,
            example: 'user1',
            description: 'Username for datacenter login at HTWG Konstanz.'
        },
        password: {
            type: 'string',
            required: true,
            example: 'password1234',
            description: 'Password for datacenter login at HTWG Konstanz.'
        },
        student: {
            type: 'boolean',
            required: true,
            description: 'If the user is a student.'
        }
    },

    exits: {
        success: {
            statusCode: 200
        },
        errorOccured: {
            statusCode: 500,
        },
        noLectures: {
            statusCode: 204,
        },
        loginFailed: {
            statusCode: 401
        },
    },

    fn: async function (inputs, exits) {
        sails.helpers.lsfCookie(inputs.username, inputs.password).then(function (data) {
            let headers = {
                'cookie': data.cookieLogin + ' ' + data.cookieRequest
            };
            getURL(data.cookieLogin + ' ' + data.cookieRequest, inputs.student, function (err, url) {
                if (err) {
                    sails.log.error(err);
                    return exits.errorOccured();
                } else {
                    request.get({
                        url: url,
                        headers: headers
                    }, function (err, httpResponse, body) {
                        if (err) {
                            sails.log.error(err);
                            return exits.errorOccured();
                        }
                        const $ = cheerio.load(body);
                        let icalURL = $('#wrapper > div.divcontent > div.content_max > form > table:nth-child(3) > tbody > tr > td:nth-child(1) > a').attr('href');
                        if (typeof icalURL === "undefined") {
                            return exits.noLectures({lectures: []});
                        }
                        const url = new URL(icalURL);
                        let termine = url.searchParams.get('termine').split(",");
                        let curr = new Date;
                        let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                        let last = first + 7; // last day is the first day + 7

                        let firstday = new Date(curr.setDate(first)).toLocaleString();
                        let lastday = new Date(curr.setDate(last)).toLocaleString();

                        //Prepare query
                        LsfLectures.getDatastore().sendNativeQuery(LSF_LECTURES_FOR_USER_SQL, [termine, firstday, lastday]).exec(function (err, rawResult) {
                            if (err) {
                                sails.log.error(err);
                                return exits.errorOccured();
                            } else {
                                let output = {lectures: []};
                                let key;
                                let index = 0;
                                for (let row of rawResult.rows) {
                                    if (typeof key === "undefined") {
                                        key = new Date(row["lectureDate"]).toLocaleDateString();
                                        output.lectures.push({date: key, lectures: []});
                                    }

                                    if (key === new Date(row["lectureDate"]).toLocaleDateString()) {
                                        output.lectures[index].lectures.push({
                                            name: row["name"],
                                            startTime: row["startTime"],
                                            endTime: row["endTime"],
                                            room: row["room"],
                                            category: row["category"]
                                        });
                                    } else {
                                        key = new Date(row["lectureDate"]).toLocaleDateString();
                                        index++;
                                        output.lectures.push({date: key, lectures: []});
                                        output.lectures[index].lectures.push({
                                            name: row["name"],
                                            startTime: row["startTime"],
                                            endTime: row["endTime"],
                                            room: row["room"],
                                            category: row["category"]
                                        });
                                    }
                                }
                                return exits.success(output);
                            }
                        });
                    });
                }
            });
        }).catch(function (error) {
            if (error.exit === "loginFailed") {
                return exits.loginFailed();
            } else {
                sails.log.error(error);
                return exits.errorOccured();
            }
        });
    }

};

function getURL(cookie, isStudent, callback) {
    if (!isStudent) {
        sails.helpers.lsfPid(data.cookieLogin + ' ' + data.cookieRequest).then(function (pidData) {
            callback(null, sails.config.custom.datacenter.lsf.lectureProfPage.replace("${pid}", pidData.pid));
        }).catch(function (err) {
            callback(err, null)
        });
    } else {
        callback(null, sails.config.custom.datacenter.lsf.lecturePage);
    }
}
