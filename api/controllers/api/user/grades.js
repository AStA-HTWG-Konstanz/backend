const oneWeek = 60 * 60 * 168 * 1000;

module.exports = {

    friendlyName: 'User grades',

    description: 'Grades for user.',

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
            description: 'Anonymous token to fetch grades from database.'
        }
    },

    exits: {
        success: {
            statusCode: 200
        },
        errorOccured: {
            statusCode: 500,
        },
        noData: {
            statusCode: 204
        }
    },

    fn: async function (inputs, exits) {
        let username = inputs.username;
        let password = inputs.password;
        let token = inputs.token;
        let refresh = true;
        if (this.req.session.APIlastRefresh) {
            let lastAccess = new Date(this.req.session.APIlastRefresh);
            let now = new Date();
            //if older than 7 days
            if ((now - lastAccess) > oneWeek) {
                refresh = true;
            } else {
                //else
                refresh = false;
            }
        } else {
            refresh = true;
        }
        if (refresh) {
            this.req.session.APIlastRefresh = new Date().toUTCString();
            await sails.helpers.gradesRefresh(username, password, token).catch((e) => {
                sails.log.error(e);
                return exits.errorOccured();
            });
        }
        let output = {};
        let gradeData = await QisGrades.find({token: token}).populate('semester').populate('course').sort('id ASC').catch((e) => {
            sails.log.error(e);
            return exits.errorOccured();
        });
        if (gradeData) {
            let sorted = gradeData.sort(function (a, b) {
                let firstYear = a.semester.semester.split(' ');
                let secondYear = b.semester.semester.split(' ');

                if (firstYear[1] < secondYear[1]) {
                    return -1;
                } else if (firstYear[1] > secondYear[1]) {
                    return 1;
                } else {
                    return 0;
                }
            });
            output["grades"] = [];
            currSemester = "";
            currIdx = -1;
            for (let i in sorted) {
                if (currSemester != sorted[i].semester.semester) {
                    output["grades"].push({
                        semesterIdentifier: sorted[i].semester.semester,
                        semesterPerformance: []
                    })
                    currSemester = sorted[i].semester.semester;
                    currIdx = currIdx + 1;
                }

                output["grades"][currIdx]["semesterPerformance"].push({
                    course: sorted[i].course.course,
                    name: sorted[i].name,
                    grade: sorted[i].grade.toString().replace('.', ','),
                    ects: sorted[i].ects.toString().replace('.', ','),
                    passed: sorted[i].passed,
                    bachelor: sorted[i].bachelor,
                    master: sorted[i].master
                });

            }
            return exits.success(output);
        } else {
            return exits.noData({});
        }

    }
};
