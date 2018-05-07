module.exports = {

    friendlyName: 'Publish news',

    description: 'Provide action to publish news.',

    inputs: {
        categorySelect: {
            type: 'number',
            description: 'Selected category',
            required: true
        },
        title: {
            type: 'string',
            description: 'News title',
            required: true
        },
        shortDescription: {
            type: 'string',
            description: 'Short description of your news',
            required: true
        },
        newsText: {
            type: 'string',
            description: 'News content',
            required: true
        }
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
        if (inputs.categorySelect === 0) {
            return exits.noCategory();
        } else {
            News.create({
                title: inputs.title,
                short_desc: inputs.shortDescription,
                content: inputs.newsText,
                category: inputs.categorySelect
            }).then(function () {
                return exits.success();
            }).catch(function (error) {
                sails.log(error);
                return exits.errorOccured()
            });
        }
    }
};
