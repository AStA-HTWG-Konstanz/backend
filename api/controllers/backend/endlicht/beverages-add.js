module.exports = {

    friendlyName: 'Add a beverage',

    description: 'Provide action to add a new beverage.',

    inputs: {
        beverageName: {
            type: 'string',
            example: 'Espresso',
            description: 'New beverage to add.',
            required: true
        },
        beveragePrice: {
            type: 'number',
            example: 1.10,
            description: 'Price of the beverage',
            required: true
        }
    },

    exits: {
        success: {
            statusCode: 200,
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
        EndlichtBeverages.alreadyExists({name: inputs.beverageName}).then(function (result) {
            return exits.alreadyExists();
        }).catch(function (error) {
            EndlichtBeverages.create({name: inputs.beverageName, price: inputs.beveragePrice}).then(function () {
                return exits.success();
            }).catch(function (error) {
                sails.log(error);
                return exits.errorOccured()
            });
        });
    }
};
