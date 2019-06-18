module.exports = {

    friendlyName: 'Contact View',

    description: 'Provide contact page.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/contact'
        }
    },

    fn: async function (inputs, exits) {
        return exits.success({page: 'contact'});
    }
};
