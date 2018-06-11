module.exports = {

    friendlyName: 'Delete beverage',

    description: 'Provide action to delete beverage.',

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
        EndlichtBeverages.destroy({id: this.req.params.id}).then(function () {
            return exits.success();
        }).catch(function (error) {
            sails.log(error);
            return exits.errorOccured();
        });
    }
};
