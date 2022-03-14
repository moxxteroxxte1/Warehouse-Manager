const router = require('express').Router()

router.all('*', (req, res) => {
    res.status(503)
})

module.exports = router
