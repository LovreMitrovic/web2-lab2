require('dotenv').config();
const express = require('express');
const app = express();
const indexController = require('./controllers/index.controller.js');
const settingsController = require('./controllers/settings.controller.js');
const shopsController = require('./controllers/shops.controller');
const shopController = require('./controllers/shop.controller');
const {auth} = require("express-openid-connect");
const https = require("https");
const fs = require("fs");
const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.urlencoded({ extended: false }));

app.use(auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: externalUrl || `https://localhost:${port}`,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    clientSecret: process.env.CLIENT_SECRET
}));

app.use( function (req, res, next) {
    res.locals.user = req.oidc.isAuthenticated() ? req.oidc.user : null;
    req.isAdmin = req.oidc.user != null && req.oidc.user.email === process.env.ADMIN_EMAIL;
    next();
});
cookieParser = require('cookie-parser');
app.use(cookieParser());

// set a cookie
app.use(function (req, res, next) {
    // check if client sent cookie
    let cookie = req.cookies.cookieName;
    if (cookie === undefined) {
        // no: set a new cookie
        let randomNumber=Math.random().toString();
        randomNumber=randomNumber.substring(2,randomNumber.length);
        res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
        console.log('cookie created successfully');
    } else {
        // yes, cookie was already present
        console.log('cookie exists', cookie);
    }
    next(); // <-- important!
});

app.get('/c',(req,res)=>{
    res.send(req.cookies);
});


app.use('/public', express.static('public'));

app.get('/', indexController.get);

app.get('/shops/:id/:user', shopController.get)

app.get('/shops', shopsController.get);

app.post('/settings', settingsController.post);


if(externalUrl){
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`Server is running locally on http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
} else {
    https.createServer({
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem'),
    },app).listen(port, () => {
        console.log(`Server is running on https://localhost:${port}/`);
    });
}