require('dotenv').config()

const express = require('express')
const app = express();
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const multer = require('multer');


const MongoDbStore = require('connect-mongo')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3300

//Database connection
const url = 'mongodb://localhost/digistore'
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected!')
}).catch(err => {
    console.log("Connection Failed")
})



//session Configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        client: connection.getClient()
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }

}));

app.use(flash());


//Passport Config
const passportInit = require('./app/config/passport');
passportInit(passport);


app.use(passport.initialize())
app.use(passport.session())

//Assets
app.use(express.static('public'))
//setting Template
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

//Express-enable json
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

//GlobalMiddleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`App is Live on http://localhost:${PORT}`)
})