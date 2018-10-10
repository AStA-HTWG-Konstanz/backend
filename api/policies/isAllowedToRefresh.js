const oneWeek = 60 * 60 * 168 * 1000;
const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
module.exports = async function (req, res, proceed) {

    //check if required parameter is present
    if (typeof req.body.token !== "undefined") {
        let token = req.body.token;
        //get latest access from database
        let latestAccess = await QisGradesRefresh.findOne({token: req.body.token}).catch(function (e) {
            sails.log.error(e);
            return res.serverError();
        });

        let dateToday = new Date().toLocaleDateString('ko-KR', options).replace(/\s/g, '').split(".").join("-").slice(0, -1);

        if (latestAccess) {
            //if latestAccess is found check if older than 7 days
            let now = new Date();
            if ((now - new Date(latestAccess.lastRefreshDate)) > oneWeek) {
                //set today as new last accessed date
                await QisGradesRefresh.update({token: token},{lastRefreshDate: dateToday}).catch(function (e) {
                    sails.log.error(e);
                    res.serverError();
                });
                return proceed();
            }
            return res.ok();
        } else {
            //if no latest access is found a new one is created
            await QisGradesRefresh.create({token: token, lastRefreshDate: dateToday}).catch(function (e) {
                sails.log.error(e);
                return res.serverError();
            });
            return proceed();
        }
    } else {
        return res.serverError();
    }
};
