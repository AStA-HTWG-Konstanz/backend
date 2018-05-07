/**
 * LsfLectures.js
 *
 * @description :: LSF Lectures
 */

module.exports = {

    attributes: {
        lsfID: {
            type: 'number',
            required: true
        },
        lsfCourseID: {
            type: 'number',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        prof: {
            type: 'string',
            required: false
        },
        startTime: {
            type: 'ref',
            columnType: 'time',
            required: true
        },
        room: {
            type: 'string',
            required: false
        },
        category: {
            type: 'string',
            required: true
        },
        endTime: {
            type: 'ref',
            columnType: 'time',
            required: true
        },
        students: {
            collection: 'user',
            via: 'lectures'
        },
        dates : {
            collection: 'lsflecturedates',
            via: 'lecture'
        }
    }
};
