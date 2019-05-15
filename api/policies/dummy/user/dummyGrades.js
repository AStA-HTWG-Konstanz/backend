module.exports = async function (req, res, proceed) {
<<<<<<< Updated upstream
    if (req.session.APIusername === "testUser") {
        res.status(204);
        return res.end();
=======
    return res.ok(grades);

    /*if (req.session.APIusername === "testUser") {
>>>>>>> Stashed changes
    } else {
        return proceed();
    }*/
};
