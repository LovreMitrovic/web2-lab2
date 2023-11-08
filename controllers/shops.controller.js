const Shops = require('../models/shops.model.js');
const Settings = require('../models/settings.model.js');

const get = (req, res) => {
    const { keyword } = req.query;
    let keywordHtml;
    let shopsList = keyword ? Shops.search(keyword): [];
    if(!Settings.xss) {
        keywordHtml = keyword.replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\//g, '&#x2F;')
            .replace(/\\/g, '&#x5C;')
    } else {
        keywordHtml = keyword;
    }
    let userType = req.isAdmin ? 'admin' : 'user';
    if(!Settings.ca) {
        shopsList = shopsList.map(shop => ({
            ...shop, link: `/shops/${shop['uuid']}/${userType}`
        }));
    } else {
        shopsList = shopsList.map(shop => ({
            ...shop, link: `/shops/${shopsList.indexOf(shop)}/${userType}`
        }));
    }
    res.render('shops', {
        shops: shopsList,
        keyword: keywordHtml
    });
}

module.exports = { get };