module.exports = {

    friendlyName: 'Dashboard View',

    description: 'Provide dashboard page.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/dashboard'
        }
    },

    fn: async function (inputs, exits) {
        return exits.success({page: 'dashboard'});
    }
};
