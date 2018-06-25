module.exports = {

    friendlyName: 'User grades',

    description: 'Grades for user.',

    inputs: {
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
        let token = inputs.token;
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
            for (let i in sorted) {
                if (typeof output[sorted[i].semester.semester] === 'undefined') {
                    output[sorted[i].semester.semester] = [];
                }

                output[sorted[i].semester.semester].push({
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
