const router = require('express').Router()

const {
    SESSIONNAME = 'sid'
} = process.env

router.use(require('../middlewares/redirectLogin'))

router.post('/', (req, res) => {
    req.session.destroy(err => {
        if(err)
            return res.redirect('/')

        res.clearCookie(SESSIONNAME)
        res.redirect('/')
    });
})

module.exports = router
