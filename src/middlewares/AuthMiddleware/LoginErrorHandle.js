module.exports = async (err, req, res, next) => {
    res.clearCookie('jwt');
    res.cookie('err', err.message);
    res.redirect(req.query.callbackURL);
}