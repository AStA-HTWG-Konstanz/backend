module.exports = {

    friendlyName: 'Publish Event',

    description: 'Provide action to publish a Event.',

    inputs: {
        title: {
            type: 'string',
            description: 'Date title',
            required: true
        },
        eventDate: {
            type: 'string',
            description: 'dates for this Event',
            required: true
        },
    },

    exits: {
        success: {
            statusCode: 200,
            responseType: ''
        },
        errorOccured: {
            statusCode: 500,
            responseType: ''
        },
        noCategory: {
            statusCode: 400,
            responseType: ''
        }
    },

    fn: async function (inputs, exits) {
            Event.create({
                title: inputs.title,
                eventDate: inputs.eventDate,
            }).then(function () {
                return exits.success();
            }).catch(function (error) {
                sails.log.error(error);
                return exits.errorOccured()
            });
        }

};
