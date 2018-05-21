module.exports = async function (req, res, proceed) {

    if (req.session.APIlogged) {
        return proceed();
    }

    return res.forbidden();
};
