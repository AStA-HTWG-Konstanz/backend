module.exports = {

    friendlyName: 'Set opening hours',

    description: 'Provide action to set opening hours.',

    inputs: {},

    exits: {
        success: {
            statusCode: 200,
            responseType: ''
        },
        errorOccured: {
            statusCode: 500,
            responseType: ''
        },
        invalidRequest: {
            statusCode: 400,
            responseType: ''
        }
    },

    fn: async function (inputs, exits) {
        try {
            for (let day in this.req.query) {
                try {
                    let times = this.req.query[day].split("/");
                    await EndlichtHours.update({weekday: day}).set({
                        startTime: times[0],
                        endTime: times[1]
                    }).catch((err) => {
                        return exits.invalidRequest();
                    });
                } catch (e) {
                    return exits.invalidRequest();
                }
            }
            return exits.success();
        } catch (e) {
            sails.log.error(e);
            return exits.errorOccured();
        }
    }
};
