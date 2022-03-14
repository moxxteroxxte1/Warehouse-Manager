var redirectLogin = module.exports = function (req, res, next) {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}


