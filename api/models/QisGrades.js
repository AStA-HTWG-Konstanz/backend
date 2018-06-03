/**
 * QisGrades.js
 *
 * @description :: Qis student grades
 */

module.exports = {
    attributes: {
        examID: {
            type: 'number',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        grade: {
            type: 'number',
            required: true
        },
        ects: {
            type: 'number',
            required: true
        },
        passed: {
            type: 'boolean',
            required: true
        },
        token: {
            type: 'string',
            required: true
        },
        bachelor: {
            type: 'boolean',
            required: true
        },
        master: {
            type: 'boolean',
            required: true
        },
        semester: {
            model: 'qissemester'
        },
        course: {
            model: 'qiscourses'
        }
    }
};
