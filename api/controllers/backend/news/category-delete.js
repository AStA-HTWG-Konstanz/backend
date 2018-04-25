module.exports = {

    friendlyName: 'Delete a category',

    description: 'Provide action to delete a category.',

    inputs: {},

    exits: {
        success: {
            statusCode: 200,
            responseType: ''
        },
        errorOccured: {
            statusCode: 500,
            responseType: ''
        }
    },

    fn: async function (inputs, exits) {
        Categories.destroy({id: this.req.params.id}).then(function () {
            return exits.success();
        }).catch(function (error) {
            sails.log(error);
            return exits.errorOccured();
        });
    }
};
