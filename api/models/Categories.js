/**
 * Categories.js
 *
 * @description :: Categories
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        }
    },
    alreadyExists: async function(opts) {
        let category = await Categories.findOne({name: opts.name});
        if (!category) {
            throw new Error("Cannot find Category.");
        }
        return true;
    }
};

