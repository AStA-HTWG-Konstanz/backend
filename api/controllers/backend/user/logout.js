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
        this.req.session.destroy();
        exits.success('/login');
    }
};
