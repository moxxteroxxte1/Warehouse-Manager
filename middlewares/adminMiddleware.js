const adminMiddleware = module.exports = function (req, res, next) {
    if(req.session.admin) {
        return next()
    }
    res.redirect('/')
}
