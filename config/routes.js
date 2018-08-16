/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


    //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
    //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
    //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` your home page.            *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    'GET /': {
        action: 'frontend/download-view'
    },
    'GET /dashboard': {
        action: 'backend/dashboard/dashboard-view'
    },
    'GET /login': {
        action: 'backend/user/login-view'
    },
    'POST /login': {
        action: 'backend/user/login'
    },
    'GET /logout': {
        action: 'backend/user/logout'
    },
    'GET /setup': {
        action: 'backend/user/setup-view'
    },
    'POST /setup': {
        action: 'backend/user/setup'
    },
    'GET /news': {
        action: 'backend/news/news-view'
    },
    'POST /category/add': {
        action: 'backend/news/category-add'
    },
    'GET /category/delete/:id': {
        action: 'backend/news/category-delete'
    },
    'POST /news/add': {
        action: 'backend/news/news-add'
    },
    'GET /news/delete/:id': {
        action: 'backend/news/news-delete'
    },
    'GET /endlicht': {
        action: 'backend/endlicht/endlicht-view'
    },
    'POST /endlicht/beverages/add': {
        action: 'backend/endlicht/beverages-add'
    },
    'GET /endlicht/beverages/delete/:id': {
        action: 'backend/endlicht/beverages-delete'
    },
    'GET /endlicht/special/set/:id': {
        action: 'backend/endlicht/special-set'
    },
    'GET /endlicht/hours/set': {
        action: 'backend/endlicht/hours-set'
    },
    'GET /events': {
        action: 'backend/events/event-view'
    },
    'POST /events/add': {
        action: 'backend/events/event-add'
    },
    'GET /events/delete/:id': {
        action: 'backend/events/event-delete'
    },
    'GET /policy': {
        view: 'policy'
    },


    /***************************************************************************
     *                                                                          *
     * More custom routes here...                                               *
     * (See https://sailsjs.com/config/routes for examples.)                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the routes in this file, it   *
     * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
     * not match any of those, it is matched against static assets.             *
     *                                                                          *
     ***************************************************************************/


    //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
    //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
    //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
    'GET /api/canteen/:language/menu': {
        action: 'api/canteen/menu'
    },
    'GET /api/news/:page/:elements': {
        action: 'api/news/news'
    },
    'GET /api/news/categories': {
        action: 'api/news/categories'
    },
    'POST /api/user/auth': {
        action: 'api/user/auth'
    },
    'POST /api/user/balance': {
        action: 'api/user/balance'
    },
    'POST /api/user/lectures': {
        action: 'api/user/lectures'
    },
    'POST /api/user/grades': {
        action: 'api/user/grades'
    },
    'POST /api/user/grades/refresh': {
        action: 'api/user/grades-refresh'
    },
    'GET /api/endlicht': {
        action: 'api/endlicht/endlicht'
    },
    'GET /api/events': {
        action: 'api/events/events'
    }


    //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
    //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
    //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


    //  ╔╦╗╦╔═╗╔═╗
    //  ║║║║╚═╗║
    //  ╩ ╩╩╚═╝╚═╝


};
