module.exports = {

    friendlyName: 'Setup admin user',

    description: 'Provide page to create first user.',

    inputs: {
        username: {
            type: 'string',
            example: 'user1',
            description: 'Username for datacenter login at HTWG Konstanz.'
        }
    },

    exits: {
        success: {
            responseType: 'redirect'
        },
        userExists: {
            description: 'There is already a user.',
            responseType: 'redirect'
        },
        errorOccured: {
            responseType: 'view',
            viewTemplatePath: 'pages/setup'
        }
    },

    fn: async function (inputs, exits) {
        let backendUser = await BackendUser.countUser();
        if (backendUser > 0) {
            return exits.userExists("/login");
        }
        if (inputs.username !== "") {
            BackendUser.create({username: inputs.username, admin: true}).then(function () {
                return exits.success("/login");
            })
                .catch(function (error) {
                    sails.log(error);
                    return exits.errorOccured({errorMessage: "Failed to add user. Please try again later."})
                });
        } else {
            return exits.errorOccured({errorMessage: "Username can't be empty."});
        }
    }
};
