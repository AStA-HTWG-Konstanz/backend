module.exports = {

    friendlyName: 'Delete news',

    description: 'Provide action to delete news.',

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
        News.destroy({id: this.req.params.id}).then(function () {
            return exits.success();
        }).catch(function (error) {
            sails.log(error);
            return exits.errorOccured();
        });
    }
};
