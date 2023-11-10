const Shops = require('../models/shops.model.js');
const Settings = require('../models/settings.model.js');

const get = (req, res) => {
    const { keyword } = req.query;
    let keywordHtml;
    let shopsList = keyword ? Shops.search(keyword): [];
    if(!req.xss) {
        keywordHtml = keyword.replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\//g, '&#x2F;')
            .replace(/\\/g, '&#x5C;')
    } else {
        keywordHtml = keyword;
    }
    let userType = req.isAdmin ? 'admin' : 'user';
    let xssParam = req.xss ? 'xss=on' : 'xss=off';
    if(!req.ac) {
        shopsList = shopsList.map(shop => ({
            ...shop, link: `/shops/${shop['uuid']}/${userType}?${xssParam}`
        }));
    } else {
        shopsList = shopsList.map(shop => ({
            ...shop, link: `/shops/${shopsList.indexOf(shop)}/${userType}?ac=on&${xssParam}`
        }));
    }
    res.render('shops', {
        shops: shopsList,
        keyword: keywordHtml
    });
}

module.exports = { get };