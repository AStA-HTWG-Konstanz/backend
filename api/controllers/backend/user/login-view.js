module.exports = {

    friendlyName: 'User login',

    description: 'Provide login page.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/login'
        },
        noUserExists: {
            description: 'There is no user.',
            responseType: 'redirect'
        }
    },

    fn: async function (inputs, exits) {
        let backendUser = await BackendUser.countUser();
        if (backendUser === 0) {
            return exits.noUserExists("/setup");
        }
        return exits.success({page: 'login'});
    }
};
