const router = require('express').Router()

router.use(require('../middlewares/redirectLogin'))

router.get('/', (req, res) => {
    res.render('index', {user: {id: req.session.userId, admin: req.session.admin}})
})

module.exports = router
