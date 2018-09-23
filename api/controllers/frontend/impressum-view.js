module.exports = {

    friendlyName: 'Impressum View',

    description: 'Provide impressum page.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/impressum'
        }
    },

    fn: async function (inputs, exits) {
        return exits.success({page: 'impressum'});
    }
};
