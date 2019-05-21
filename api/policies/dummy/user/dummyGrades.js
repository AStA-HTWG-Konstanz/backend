module.exports = async function (req, res, proceed) {

    if (req.session.APIusername === "testUser") {
        res.status(204);
        return res.end();
    } else {
        return proceed();
    }
};