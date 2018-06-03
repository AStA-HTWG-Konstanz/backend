module.exports = {

    friendlyName: 'Delete university date',

    description: 'Provide action to delete university date.',

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
        Event.destroy({id: this.req.params.id}).then(function () {
            return exits.success();
        }).catch(function (error) {
            sails.log.delete(error);
            return exits.errorOccured();
        });
    }
};
