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
        this.req.session.APIlastRefresh = new Date().toUTCString();
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
        await handleData(graduations, bachelorData, masterData, function (err, res) {
            if (err) {
                sails.log.error(err);
                return exits.errorOccured();
            } else {
                output = res;
            }
        });
        return exits.success(output);
    }
};

function handleData(graduations, bachelorData, masterData, callback) {
    var gradeData = {};
    async.waterfall([
        function (cb) {
            if (graduations.bachelor) {
                parseData(bachelorData, function (err, res) {
                    if (err) {
                        sails.log.error(err);
                        cb(null, { insert: false });
                    } else {
                        cb(null, { insert: true, data: res });
                    }
                });
            } else {
                cb(null, { insert: false });
            }
        },
        function (res, cb) {
            if (res.insert) {
                insertData(res.data, true, false, gradeData, function (error, result) {
                    if (error) {
                        sails.log.error(error);
                        cb();
                    } else {
                        gradeData = result;
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
                        cb(null, { insert: false });
                    } else {
                        cb(null, { insert: true, data: res });
                    }
                });
            } else {
                cb(null, { insert: false });
            }
        },
        function (res, cb) {
            if (res.insert) {
                insertData(res.data, false, true, gradeData, function (error, result) {
                    if (error) {
                        sails.log.error(error);
                        cb();
                    } else {
                        gradeData = result;
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
            callback(null, gradeData);
        }
    });
}

function insertData(grades, bachelor, master, gradeData, callback) {

    for (gradeIdx in grades) {
        grade = grades[gradeIdx];
        if (!isNaN(grade.id)) {
            semester = grade.semester;
            if (!(gradeData.hasOwnProperty(semester))) {
                gradeData[semester] = [];
            }
            let examGrade;
            let ects = parseFloat(grade.ects.replace(",", "."));
            if (grade.grade === "") {
                examGrade = 0.0;
            } else {
                examGrade = parseFloat(grade.grade.replace(",", "."));
            }
            course = {
                course: grade.course,
                name: grade.name,
                grade: examGrade.toString().replace('.', ','),
                ects: ects.toString().replace('.', ','),
                passed: grade.passed,
                bachelor: bachelor,
                master: master
            }
            gradeData[semester].push(course);
        }
    }

    let sorted = [];
    Object.keys(gradeData).sort(function (a, b) {
        let firstYear = a.split(' ');
        let secondYear = b.split(' ');

        if (firstYear[1] < secondYear[1]) {
            return -1;
        } else if (firstYear[1] > secondYear[1]) {
            return 1;
        } else {
            return 0;
        }
    }).forEach(function (key) {
        sorted[key] = gradeData[key];
    });

    let output = {};
    output["grades"] = [];
    currSemester = "";
    var currIdx = -1;
    for (const semester of Object.keys(sorted)) {
        output["grades"].push({
            semesterIdentifier: semester,
            semesterPerformance: []
        })
        currIdx = currIdx + 1;

        for (let gradeIdx in sorted[semester]) {
            var grade = sorted[semester][gradeIdx];
            output["grades"][currIdx]["semesterPerformance"].push(grade);
        }
    }
    callback(null, output);

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
