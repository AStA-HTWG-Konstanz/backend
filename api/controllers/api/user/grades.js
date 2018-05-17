module.exports = {

    friendlyName: 'User grades',

    description: 'Grades for user.',

    inputs: {
        token: {
            type: 'string',
            required: true,
            example: 'cjdsuofh789ewzr823clds',
            description: 'Anonymous token to fetch grades from database.'
        }
    },

    exits: {
        success: {
            statusCode: 200
        },
        errorOccured: {
            statusCode: 500,
        }
    },

    fn: async function (inputs, exits) {
        let token = inputs.token;


    }
};
