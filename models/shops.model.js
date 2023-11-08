const fs = require('fs');

let data;

try {
    const jsonData = fs.readFileSync('./shops.json', 'utf8');
    data = JSON.parse(jsonData);
} catch (error) {
    console.log(error);
    data = {"shops": []};
}

const getAll = () => {
    return data.shops;
}

const search = (keyword) => {
    return data.shops.filter(shop => {
        return shop.name.toLowerCase().includes(keyword.toLowerCase()) ||
            shop.location.toLowerCase().includes(keyword.toLowerCase());
    });
}

module.exports = { getAll, search };