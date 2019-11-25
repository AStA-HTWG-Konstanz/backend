/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // Backend policies
  'backend/dashboard/dashboard-view': 'isLoggedIn',
  'backend/news/news-view': 'isLoggedIn',
  'backend/news/category-add': 'isLoggedIn',
  'backend/news/category-delete': 'isLoggedIn',
  'backend/news/news-add': 'isLoggedIn',
  'backend/news/news-delete': 'isLoggedIn',
  'backend/endlicht/endlicht-view': 'isLoggedIn',
  'backend/endlicht/beverages-add': 'isLoggedIn',
  'backend/endlicht/beverages-delete': 'isLoggedIn',
  'backend/endlicht/hours-set': 'isLoggedIn',
  'backend/endlicht/special-set': 'isLoggedIn',
  'backend/feedback/userfeedback/delete-userfeedback': 'isLoggedIn',
  'backend/feedback/userfeedback/userfeedback-view': 'isLoggedIn',

  // API policies
  'api/canteen/menu': 'isAuthenticated',
  'api/news/news': 'isAuthenticated',
  'api/news/categories': 'isAuthenticated',
  'api/user/balance': 'isAuthenticated',
  'api/user/lectures': 'isAuthenticated',
  'api/endlicht/endlicht': 'isAuthenticated',
  'api/user/grades': 'isAuthenticated',
  'api/strandbar/strandbar': 'isAuthenticated',
  //'api/feedback/userfeedback': 'isAuthenticated',


  // Dummy policies
  'api/user/auth': 'dummy/user/dummyAuth',
  'api/user/balance': 'dummy/user/dummyBalance',
  'api/user/lectures': 'dummy/user/dummyLectures',
  'api/user/grades': 'dummy/user/dummyGrades'
};
