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
        let output = {gradesReport: {}};
        let gradeData = await QisGrades.find({token: token}).populate("semester").populate("course").sort("id ASC").catch((e) => {
            sails.log.error(e);
            return exits.errorOccured();
        });
        if (gradeData) {
            for (let i in gradeData) {
                if (typeof output.gradesReport[gradeData[i].semester.semester] === "undefined") {
                    output.gradesReport[gradeData[i].semester.semester] = [];
                }
                output.gradesReport[gradeData[i].semester.semester].push({
                    course: gradeData[i].course.course,
                    name: gradeData[i].name,
                    grade: gradeData[i].grade.toString().replace(".", ","),
                    ects: gradeData[i].ects.toString().replace(".", ","),
                    passed: gradeData[i].passed,
                });
            }
            return exits.success(output);
        } else {
            return exits.noData({gradesReport: []});
        }

    }
};
