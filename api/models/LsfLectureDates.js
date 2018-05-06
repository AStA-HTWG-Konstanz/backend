/**
 * LsfLectureDates.js
 *
 * @description :: LSF Lecture Dates
 */

module.exports = {

    attributes: {
        lectureDate: {
            type: 'ref',
            columnType: 'DATE'
        },
        lecture: {
            model: 'lsflectures'
        }
    }
};
