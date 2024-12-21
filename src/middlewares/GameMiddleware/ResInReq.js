module.exports = async (req,res,next) => {
    req.res = res;
    next();
}