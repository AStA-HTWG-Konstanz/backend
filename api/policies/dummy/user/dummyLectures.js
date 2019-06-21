const lectures = require('../../../../json/lectures');
module.exports = async function (req, res, proceed) {

    if (req.session.APIusername === "testUser") {
        return res.ok(lectures);
    } else {
        return proceed();
    }
};
