const Settings = require('../models/settings.model');

const get = (req, res) => {
    res.render('index', {
        xss: Settings.xss,
        ca: Settings.ca
    })
}

module.exports = { get };