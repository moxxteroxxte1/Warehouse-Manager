const router = require('express').Router()
const bcrypt = require("bcrypt");
const connection = require('../utils/dbManager')
const {param} = require("express/lib/router");

router.use(require('../middlewares/redirectLogin'))
router.use(require('../middlewares/adminMiddleware'))

//LIST OF ALL USERS (GET)
router.get('/', (req, res) => {
    var rows = [];
    connection.query("SELECT id,name,lastname,username,admin FROM accounts WHERE 1", function (err, results, fields) {
        if (err) {
            throw err
            return res.redirect('/')
        }
        for (const key of Object.keys(results)) {
            var row = results[key];
            rows.push(row)
        }
        res.render("./user/list", {user: {id: req.session.id, admin: req.session.admin}, users: rows})
    })
})

//ADD NEW USER (POST)
router.post('/add', async (req, res) => {
    var {user, password, name, lastname, admin} = req.body;

    if (!(user && password && name && lastname && admin)) {
        return res.status(400).send({error: "Data not formatted properly"});
    }

    if (admin.length > 1) {
        admin = admin[0]
    }

    connection.query('SELECT * FROM accounts WHERE username = ?', [user], async function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
            return res.status(400).send({error: "User already exists"})
        }
    })

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);

    connection.query('INSERT INTO `accounts`(`name`, `lastname`, `username`, `password`, `admin`) VALUES (?,?,?,?,?)', [name, lastname, user, hashedPassword, admin], function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error)
            throw error;
    });

    return res.redirect('/user');
})

//GET USER PROFILE (GET)
router.get('/:id', (req, res) => {
    var user = []
    connection.query('SELECT * FROM accounts WHERE id = ?', [req.params.id],function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
            for (const key of Object.keys(results)) {
                var row = results[key];
                user.push(row)
            }
        }
        res.render('./user/main', {user: {id: req.session.id, admin: req.session.admin}, edit: user[0]})
    })
})


//DELETE USER (GET)
router.post('/:id/delete', (req, res) => {
    connection.query("DELETE FROM accounts WHERE id=?", [req.params.id], function (err, results, fields) {
        if (err)
            throw err
    })
})

router.post('/:id/update', async (req, res) => {
    var {id, name, lastname, username, password, admin} = req.body;
    console.log(req.body)

    if (!(username && name && lastname && admin)) {
        return res.status(400).send({error: "Data not formatted properly"});
    }

    if (admin.length > 1) {
        admin = admin[0]
    }

    if(password != ''){
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);

        connection.query('UPDATE `accounts` SET `name`=?,`lastname`=?,`username`=?,`password`=?,`admin`=? WHERE id=?', [name, lastname, username, hashedPassword, admin, id], function (error, results, fields) {
            if (error)
                throw error;
        });
    }else{
        connection.query('UPDATE `accounts` SET `name`=?,`lastname`=?,`username`=?, `admin`=? WHERE id=?', [name, lastname, username, admin, id], function (error, results, fields) {
            if (error)
                throw error;
        });
    }




    return res.redirect('/user/'+id);
})

module.exports = router
