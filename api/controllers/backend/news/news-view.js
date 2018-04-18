module.exports = {

    friendlyName: 'News View',

    description: 'Provide news page.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/news'
        }
    },

    fn: async function (inputs, exits) {
        return exits.success({page: 'news'});
    }
};