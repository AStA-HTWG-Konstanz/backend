const grades = require('../../../../json/grades');
module.exports = async function (req, res, proceed) {

    if (req.session.APIusername === "testUser") {
        return res.ok(grades);
    } else {
        return proceed();
    }
};