/**
 * News.js
 *
 * @description :: News
 */

module.exports = {

    attributes: {
        title: {
            type: 'string',
            required: true
        },
        short_desc: {
            type: 'string',
            required: true
        },
        content: {
            type: 'string',
            required: true
        },
        category: {
            model: 'categories',
            required: true
        }
    }
};
