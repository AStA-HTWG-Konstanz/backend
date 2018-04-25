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

        let news = await News.find();
        let newsData;
        if(!news) {
            newsData = null;
        } else {
            newsData = news;
        }

        return exits.success({page: 'news', categories: categoryData, news: newsData});

    }
};
