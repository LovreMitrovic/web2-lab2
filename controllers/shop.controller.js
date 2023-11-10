const Shops = require('../models/shops.model.js');
const Settings = require('../models/settings.model.js');

const get = (req, res) => {
    let shop;
    let id = req.params.id
    // ako je ispravan access control onda id odgovar uuid
    // inače odgovara indexu u arrayu
    if(!req.ca) {
        shop = Shops.getAll().find(shop => shop['uuid'] === id);
    } else {
        shop = Shops.getAll()[id];
    }
    if(!shop) {
        res.render('error', {code:404, error:'Not found'});
        return;
    }
    let userType = req.params.user;
    if(userType !== 'admin' && userType !== 'user') {
        res.render('error',{code:400, error:'Bad request'});
        return;
    }
    if(userType === 'user'){
        let {door_pin, ...rest} = shop;
        res.render('shop', {
            shop: rest
        });
        return;
    }
    // ako je ispravan access control onda provjeri
    // je li korisnik stvarno logiran i je li admin
    if(!req.ca) {
        if(typeof req.oidc.user === 'undefined'){// unautorised
            res.redirect('/login');
            return;
        }
        if(!req.isAdmin) {// forbidden
            res.render('error',{code:403, error:'Forbidden'});
            return;
        }
    }
    res.render('shop', {
        shop
    });
}

module.exports = { get };