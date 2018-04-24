module.exports = {

    friendlyName: 'News View',

    description: 'Provide news page.',

    inputs: {},

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'pages/news'
        }
    },

    fn: async function (inputs, exits) {
        let categories = await Categories.find();
        let categoryData;
        if(!categories) {
            categoryData = null;
        } else {
            categoryData = categories;
        }
        return exits.success({page: 'news', categories: categoryData});
    }
};
