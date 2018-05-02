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
        name: {
            type: 'string',
            required: true
        },
        prof: {
            type: 'string',
            required: true
        },
        startTime: {
            type: 'number',
            required: true
        },
        room: {
            type: 'string',
            required: true
        },
        endTime: {
            type: 'number',
            required: true
        },
        startDate: {
            type: 'ref',
            columnType: 'datetime'
        },
        endDate: {
            type: 'ref',
            columnType: 'datetime'
        },
        repeats: {
            type: 'boolean',
            required: true
        },
        repeatType: {
            type: 'string'
        },
        students: {
            collection: 'user',
            via: 'lectures'
        }
    }
};
