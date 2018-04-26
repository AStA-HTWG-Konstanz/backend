module.exports = {

    friendlyName: 'Lectures',

    description: 'User lecture data',

    inputs: {
        username: {
            type: 'string',
            required: true,
            example: 'user1',
            description: 'Username for datacenter login at HTWG Konstanz.'
        },
        password: {
            type: 'string',
            required: true,
            example: 'password1234',
            description: 'Password for datacenter login at HTWG Konstanz.'
        }
    },

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
        sails.helpers.lsfCookie(inputs.username, inputs.password).then(function (data) {
            User.create({username: inputs.username, lsfCookie: data.cookieLogin + ' ' + data.cookieRequest}).then(function () {
                return exits.success();
            }).catch(function (err) {
                return exits.errorOccured(err);
            });

        }).catch(function (error) {
           return exits.errorOccured(error);
        });

    }

};
