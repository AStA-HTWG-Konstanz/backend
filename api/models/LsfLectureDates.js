/**
 * LsfLectureDates.js
 *
 * @description :: LSF Lecture Dates
 */

module.exports = {

    attributes: {
        date: {
            type: 'ref',
            columnType: 'date'
        },
        lecture: {
            model: 'lsflectures'
        }
    }
};
