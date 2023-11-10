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
const cookieParser = require('cookie-parser');
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

app.use(cookieParser(secret = process.env.SECRET));

// this middleware is here to demonstrate cookie theft
app.use( (req, res, next) => {
   let { appSession } = req.cookies;
   if(!appSession){
       next();
   }
   res.cookie('appSessionJS', appSession, { httpOnly: false });
   next();
});

app.use( (req, res, next) => {
    res.locals.user = req.oidc.isAuthenticated() ? req.oidc.user : null;
    req.isAdmin = req.oidc.user != null && req.oidc.user.email === process.env.ADMIN_EMAIL;
    next();
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