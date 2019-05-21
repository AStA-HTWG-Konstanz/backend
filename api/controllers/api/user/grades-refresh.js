const cheerio = require('cheerio');
let async = require('async');
module.exports = {

    friendlyName: 'Refresh grades',

    description: 'Refresh grades in database.',

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
        token: {
            type: 'string',
            required: true,
            example: 'cjdsuofh789ewzr823clds',
            description: 'Anonymous token to input grades into the database.'
        }
    },

    exits: {
        success: {
            statusCode: 200
        },
        wrongCredentials: {
            statusCode: 401
        },
        errorOccured: {
            statusCode: 500,
        }
    },

    fn: async function (inputs, exits) {
        let username = inputs.username;
        let password = inputs.password;
        let cookie = await sails.helpers.qisserverCookie(username, password).catch((e) => {
            sails.log.error(e);
            return exits.errorOccured();
        });
        let asi = await sails.helpers.qisserverAsi(cookie.cookieRequest + " " + cookie.cookieLogin).catch((e) => {
            sails.log.error(e);
            return exits.errorOccured();
        });

        let graduations = await sails.helpers.qisserverGraduations(cookie.cookieRequest + " " + cookie.cookieLogin, asi).catch((e) => {
            sails.log.error(e);
            return exits.errorOccured();
        });

        let bachelorData;
        let masterData;
        if (graduations.bachelor) {
            let bData = await sails.helpers.qisserverTable(cookie.cookieRequest + " " + cookie.cookieLogin, asi, sails.config.custom.datacenter.qisserver.bachelorGradesPage).catch((e) => {
                sails.log.error(e);
                return exits.errorOccured();
            });
            bachelorData = cheerio.load(bData);
        } else {
            bachelorData = null;
        }

        if (graduations.master) {
            let mData = await sails.helpers.qisserverTable(cookie.cookieRequest + " " + cookie.cookieLogin, asi, sails.config.custom.datacenter.qisserver.masterGradesPage).catch((e) => {
                sails.log.error(e);
                return exits.errorOccured();
            });
            masterData = cheerio.load(mData);
        } else {
            masterData = null;
        }
        handleData(graduations, bachelorData, masterData, inputs.token, function (err, res) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            } else {
                return exits.success();
            }
        });
    }
};

function handleData(graduations, bachelorData, masterData, token, callback) {
    async.waterfall([
        function (cb) {
            if (graduations.bachelor) {
                parseData(bachelorData, function (err, res) {
                    if (err) {
                        sails.log.error(err);
                        cb(null, {insert: false});
                    } else {
                        cb(null, {insert: true, data: res});
                    }
                });
            } else {
                cb(null, {insert: false});
            }
        },
        function (res, cb) {
            if (res.insert) {
                insertData(res.data, token, true, false, function (error, result) {
                    if (error) {
                        sails.log.error(error);
                        cb();
                    } else {
                        cb();
                    }
                });
            } else {
                cb();
            }
        },
        function (cb) {
            if (graduations.master) {
                parseData(masterData, function (err, res) {
                    if (err) {
                        sails.log.error(err);
                        cb(null, {insert: false});
                    } else {
                        cb(null, {insert: true, data: res});
                    }
                });
            } else {
                cb(null, {insert: false});
            }
        },
        function (res, cb) {
            if (res.insert) {
                insertData(res.data, token, false, true, function (error, result) {
                    if (error) {
                        sails.log.error(error);
                        cb();
                    } else {
                        cb();
                    }
                });
            } else {
                cb();
            }
        }
    ], function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
}

function insertData(grades, token, bachelor, master, callback) {
    async.forEachOfSeries(grades, function (grade, key, cb) {
        if (!isNaN(grade.id)) {
            async.waterfall([
                function (cbk) {
                    QisSemester.findOrCreate({semester: grade.semester}, {semester: grade.semester}).then(function (semester) {
                        cbk(null, semester.id);
                    }).catch(function (e) {
                        cbk(e);
                    });
                },
                function (semesterID, cbk) {
                    QisCourses.findOrCreate({course: grade.course}, {course: grade.course}).then(function (course) {
                        cbk(null, {semester: semesterID, course: course.id});
                    }).catch(function (e) {
                        cbk(e);
                    });
                },
                function (data, cbk) {
                    let examGrade;
                    let ects = parseFloat(grade.ects.replace(",", "."));
                    if (grade.grade === "") {
                        examGrade = 0.0;
                    } else {
                        examGrade = parseFloat(grade.grade.replace(",", "."));
                    }
                    QisGrades.findOrCreate({
                        examID: grade.id,
                        name: grade.name,
                        grade: examGrade,
                        ects: ects,
                        passed: grade.passed,
                        token: token,
                        semester: data.semester,
                        course: data.course,
                        bachelor: bachelor,
                        master: master
                    }, {
                        examID: grade.id,
                        name: grade.name,
                        grade: examGrade,
                        ects: ects,
                        passed: grade.passed,
                        token: token,
                        semester: data.semester,
                        course: data.course,
                        bachelor: bachelor,
                        master: master
                    }).then(function () {
                        cbk();
                    }).catch(function (e) {
                        cbk(e);
                    });
                }
            ], function (error, result) {
                if (error) {
                    sails.log.error(error);
                }
                cb();
            })
        } else {
            cb();
        }
    }, function (err, res) {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
}

function parseData($, callback) {
    let output = [];
    try {
        $('#wrapper > div.divcontent > div.content > form > table:nth-child(5) > tbody').children("tr").each(function (i) {
            if ($(this).find("td").eq(3).text().trim() !== "" && !isNaN($(this).find("td").eq(1).text().trim())) {
                try {
                    let passed = $(this).find("td").eq(6).text().trim() === "bestanden";
                    output.push({
                        id: $(this).find("td").eq(1).text().trim(),
                        course: $(this).find("td").eq(0).text().trim(),
                        name: $(this).find("td").eq(2).text().trim(),
                        grade: $(this).find("td").eq(5).text().trim(),
                        semester: $(this).find("td").eq(3).text().trim(),
                        ects: $(this).find("td").eq(4).text().trim(),
                        passed: passed
                    });
                } catch (error) {
                    sails.log.error(error);
                }
            }
        });
        callback(null, output)
    } catch (e) {
        sails.log.error(e);
        callback(e);
    }
}
