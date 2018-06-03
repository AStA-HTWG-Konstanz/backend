module.exports = {

    friendlyName: 'Set beverage as special',

    description: 'Provide action to set beverage as special.',

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
        EndlichtBeverages.update({special: true}).set({special: false}).then(() => {
            EndlichtBeverages.update({id: this.req.params.id}).set({special: true}).then(() => {
                return exits.success();
            }).catch(function (err) {
                sails.log.error(err);
                return exits.errorOccured();
            });
        }).catch(function (error) {
            sails.log.error(error);
            return exits.errorOccured();
        });
    }
};
