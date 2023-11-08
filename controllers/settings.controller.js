const Settings = require('../models/settings.model.js')

const post = (req, res) => {
    const {xss, ca} = req.body;
    Settings.xss = xss === 'on';
    Settings.ca = ca === 'on';
    console.log(Settings);
    res.redirect('/')
}

module.exports = { post };