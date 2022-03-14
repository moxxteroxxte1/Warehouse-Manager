var redirectHome = module.exports = function (req, res, next) {
    if (req.session.userId) {
        res.redirect('/')
    } else {
        next()
    }
}
