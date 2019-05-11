module.exports = {

    friendlyName: 'Add a category',

    description: 'Provide action to add a new category.',

    inputs: {
        categoryName: {
            type: 'string',
            example: 'Party',
            description: 'New category to add.'
        }
    },

    exits: {
        success: {
            statusCode: 200,
            responseType: ''
        },
        emptyParameters: {
            statusCode: 400,
            responseType: ''
        },
        alreadyExists: {
            statusCode: 409,
            responseType: ''
        },
        errorOccured: {
            statusCode: 500,
            responseType: ''
        }
    },

    fn: async function (inputs, exits) {
        if (inputs.categoryName === "") {
            return exits.emptyParameters();
        }
        Categories.alreadyExists({name: inputs.categoryName}).then(function (result) {
            return exits.alreadyExists();
        }).catch(function (error) {
            Categories.create({name: inputs.categoryName}).then(function () {
                return exits.success();
            }).catch(function (error) {
                sails.log.error(error);
                return exits.errorOccured()
            });
        });
    }
};
