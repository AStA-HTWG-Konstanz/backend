/**
 * BackendUser.js
 *
 * @description :: Backend User
 */

module.exports = {

    attributes: {
        username: {
            type: 'string',
            required: true
        },
        admin: {
            type: 'boolean',
            defaultsTo: false
        },
        editor: {
            type: 'boolean',
            defaultsTo: true
        }
    },
    findUser: async function(opts) {
        let user = await BackendUser.findOne({username: opts.username});
        if (!user) {
            throw new Error("Cannot find User.");
        }
        return user;
    },
    countUser: async function(opts) {
         return await BackendUser.count();
    }
};

