module.exports = async function (req, res, proceed) {

    if (req.session.username) {
        return proceed();
    }

    return res.redirect('/login');
};
