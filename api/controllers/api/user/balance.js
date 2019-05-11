module.exports = {

    friendlyName: 'User balance',

    description: 'Printer and canteen balance for user.',

    inputs: {
        username: {
            type: 'string',
            required: true,
            example: 'user1',
            description: 'Username for datacenter login at HTWG Konstanz.'
        },
        password: {
            type: 'string',
            required: true,
            example: 'password1234',
            description: 'Password for datacenter login at HTWG Konstanz.'
        }
    },

    exits: {
        success: {
            statusCode: 200
        },
        wrongCredentials: {
            statusCode: 401
        },
        errorOccured: {
            statusCode: 500,
        }
    },

    fn: async function (inputs, exits) {
        let username = inputs.username;
        let password = inputs.password;

        sails.helpers.printerBalance(username, password).then((data) => {
            return exits.success({balance:{print: data.balance}});
        }).catch(function (err) {
            sails.log.error(err);
            if (err.code === "loginFailed") {
                return exits.wrongCredentials();
            } else {
                return exits.errorOccured();
            }
        });
    }
};
