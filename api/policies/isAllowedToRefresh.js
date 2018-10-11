const oneWeek = 60 * 60 * 168 * 1000;
module.exports = async function (req, res, proceed) {

    if (req.session.APIlastRefresh) {
        let lastAccess = new Date(req.session.APIlastRefresh);
        let now = new Date();
        //if older than 7 days
        if ((now - lastAccess) > oneWeek) {
            req.session.APIlastRefresh = new Date().toUTCString();
            return proceed();
        } else {
            //else
            return res.ok();
        }
    } else {
        //set to today
        req.session.APIlastRefresh = new Date().toUTCString();
        return proceed();
    }
};
