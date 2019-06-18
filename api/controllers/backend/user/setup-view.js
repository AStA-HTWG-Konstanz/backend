module.exports = {

    friendlyName: 'Setup admin user',

    description: 'Provide page to create first user.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/setup'
        },
        userExists: {
            description: 'There is already a user.',
            responseType: 'redirect'
        }
    },

    fn: async function (inputs, exits) {
        let backendUser = await BackendUser.countUser();
        if (backendUser > 0) {
            return exits.userExists("/login");
        }
        return exits.success({page: 'setup'});
    }
};
