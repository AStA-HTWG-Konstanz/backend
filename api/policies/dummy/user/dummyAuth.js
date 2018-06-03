module.exports = async function (req, res, proceed) {

    if (req.body.username === "testUser") {
        if (req.body.password === "testPass1") {
            req.session.APIlogged = true;
            req.session.APIusername = req.body.username;
            return res.ok();
        } else {
            return res.badRequest();
        }
    } else {
        return proceed();
    }
};
