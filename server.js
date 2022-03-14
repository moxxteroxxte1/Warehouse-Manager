const bodyParser = require('body-parser')
const express = require('express')
const path = require('path');
const session = require('express-session')

require('dotenv').config()

const {
    PORT = 3000,
    SESSIONNAME = 'sid',
    SESSIONSECRET = 'secret',
} = process.env

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
    name: SESSIONNAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSIONSECRET,
}))

//LOGIN ROUTER
app.use('/login', require('./routers/LoginRouter'))

//LOGOUT ROUTER
app.use('/logout', require('./routers/LogoutRouter'))

//REGISTER ROUTES
app.use('/user', require('./routers/UserRouter'))

//PRODUCT ROUTES
app.use('/product', require('./routers/productRouter'))

//ENTRY ROUTER
app.use('/', require('./routers/IndexRouter'))

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
