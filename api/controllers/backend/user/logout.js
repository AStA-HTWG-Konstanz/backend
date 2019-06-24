module.exports = {

    friendlyName: 'Logout user',

    description: 'Provide logout action.',

    inputs: {},

    exits: {
        success: {
            responseType: 'redirect'
        }
    },

    fn: async function (inputs, exits) {
        try {
            this.req.session.destroy();
            exits.success('/login');
        } catch (error) {
            sails.log.error(error);
            exits.failure.errorOccured();

        }
    }
};
