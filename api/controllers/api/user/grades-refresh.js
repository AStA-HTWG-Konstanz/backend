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

        let data = await sails.helpers.qisserverTable(cookie.cookieRequest + " " + cookie.cookieLogin, asi).catch((e) => {
            sails.log.error(e);
            return exits.errorOccured();
        });
        let $ = cheerio.load(data);
        parseData($, function (err, res) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            } else {
                insertData(res, inputs.token, function (error, result) {
                    if(error) {
                        return exits.errorOccured();
                    } else {
                        return exits.success();
                    }
                });
            }
        });
    }
};

function insertData(grades, token, callback) {
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
                        course: data.course
                    }, {
                        examID: grade.id,
                        name: grade.name,
                        grade: examGrade,
                        ects: ects,
                        passed: grade.passed,
                        token: token,
                        semester: data.semester,
                        course: data.course
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
            let course = $(this).find("td:nth-child(1)");
            let id = $(this).find("td:nth-child(2)");
            let names = $(this).find("td:nth-child(3)");
            let semester = $(this).find("td:nth-child(4)");
            let ects = $(this).find("td:nth-child(5)");
            let grades = $(this).find("td:nth-child(6)");
            let status = $(this).find("td:nth-child(7)");
            names.each(function (i) {
                let passed = $(status[i]).text().trim() === "bestanden";
                try {
                    output.push({
                        id: $(id[i]).text().trim(),
                        course: $(course[i]).text().trim(),
                        name: $(this).text().trim(),
                        grade: $(grades[i]).text().trim(),
                        semester: $(semester).text().trim(),
                        ects: $(ects).text().trim(),
                        passed: passed
                    });
                } catch (error) {
                    sails.log.error(error);
                }
            });
        });
        callback(null, output)
    } catch (e) {
        callback(e);
    }
}
