const balance = require('../../../../json/balance');
module.exports = async function (req, res, proceed) {

    if (req.session.APIusername === "testUser") {
        return res.ok(balance);
    } else {
        return proceed();
    }
};
