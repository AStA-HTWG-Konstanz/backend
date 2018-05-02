module.exports = {

    friendlyName: 'Lectures',

    description: 'User lecture data',

    inputs: {},

    exits: {
        success: {
            statusCode: 200
        },
        errorOccured: {
            statusCode: 500,
            responseType: ''
        },
        loginFailed: {
            statusCode: 401
        },
    },

    fn: async function (inputs, exits) {
        /*sails.helpers.lsfCookie(inputs.username, inputs.password).then(function (data) {
            User.create({username: inputs.username, lsfCookie: data.cookieLogin + ' ' + data.cookieRequest}).then(function () {
                return exits.success();
            }).catch(function (err) {
                return exits.errorOccured(err);
            });

        }).catch(function (error) {
           return exits.errorOccured(error);
        });*/
        User.findOne({username: 'ma431hau'}).then(function (user) {

            console.log(user.lsfCookie);
            sails.helpers.lsfLectures(user.lsfCookie).then(function (data) {
               return exits.success();
            }).catch(function (err) {
               return exits.errorOccured(err);
            });
        });

    }

};
