const bcrypt = require("bcrypt");
const router = require('express').Router();
const connection = require('../utils/dbManager')

router.use(require('../middlewares/redirectHome'))

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res) => {
    const {user, password} = req.body

    if (user && password) {
        connection.query('SELECT * FROM accounts WHERE username = ?', [user], async function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                for (const key of Object.keys(results)) {
                    var row = results[key];
                    const validPassword = await bcrypt.compare(password, row.password);
                    if (validPassword) {
                        req.session.userId = row.id
                        req.session.admin = Boolean(row.admin)
                        return res.redirect('/')
                    } else {
                        return res.render('login', {error: "Falsches Passwort!"})
                    }
                }
            } else {
                return res.render('login', {error: "Falscher Benutzername und/oder Passwort!"})
            }
        });
    } else {
        return res.render('login', {error: "Bitte gib einen Benutzernamen und ein Passwort ein!"})
    }
})

module.exports = router;
