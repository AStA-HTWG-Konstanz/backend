/**
 * User.js
 *
 * @description :: User
 */

module.exports = {

    attributes: {
        username: {
            type: 'string',
            required: true
        },
        lsfCookie: {
            type: 'string'
        },
        lectures: {
            collection: 'lsflectures',
            via: 'students'
        }
    }
};
