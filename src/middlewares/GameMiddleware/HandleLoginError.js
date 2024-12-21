module.exports = async (req, res, next) => {
    if (!req.cookies.jwt) {
        const err = req.cookies.err;
        return res.redirect(`https://localhost:3000/LoginSignUp/?err=${err}`);
    }
    next();
}