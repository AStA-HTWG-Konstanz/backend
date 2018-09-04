module.exports = {

    friendlyName: 'Download View',

    description: 'Provide download page.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/download'
        }
    },

    fn: async function (inputs, exits) {
        return exits.success({page: 'download'});
    }
};
