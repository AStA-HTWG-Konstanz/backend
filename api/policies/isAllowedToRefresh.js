const oneWeek = 60 * 60 * 168 * 1000;
const moment = require('moment');

module.exports = async function (req, res, proceed) {

    //check if required parameter is present
    if (typeof req.body.token !== "undefined") {
        let token = req.body.token;
        //get latest access from database
        let latestAccess = await QisGradesRefresh.findOne({token: req.body.token}).catch(function (e) {
            sails.log.error(e);
            return res.serverError();
        });

        let dateToday = moment().format('YYYY-MM-DD');

        if (latestAccess) {
            //if latestAccess is found check if older than 7 days
            let now = new Date();
            if ((now - new Date(latestAccess.lastRefreshDate)) > oneWeek) {
                //set today as new last accessed date
                QisGradesRefresh.update({token: token}).set({lastRefreshDate: dateToday}).then(() => {
                    return proceed();
                }).catch(function (e) {
                    sails.log.error(e);
                    res.serverError();
                });
            } else {
                return res.ok();
            }
        } else {
            //if no latest access is found a new one is created
            QisGradesRefresh.create({token: token, lastRefreshDate: dateToday}).then(() => {
                return proceed();
            }).catch(function (e) {
                sails.log.error(e);
                return res.serverError();
            });
        }
    } else {
        return res.serverError();
    }
};
