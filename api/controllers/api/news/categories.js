module.exports = {

    friendlyName: 'Categories',

    description: 'Provide categories to the app.',

    inputs: {},

    exits: {
        success: {
            statusCode: 200
        },
        errorOccured: {
            statusCode: 500,
            responseType: ''
        }
    },

    fn: async function (inputs, exits) {
        Categories.find({select: ['id', 'name']}).then(function (data) {
            return exits.success({categories: data});
        }).catch(function (error) {
            sails.log.error(error);
            return exits.errorOccured();
        });
    }
};
