const db = require('../util/database');
const result = require('./users');

const Promotion = db.execute(`create table if not exists promocodes (
    code varchar(15) NOT NULL PRIMARY KEY,
    expiration_date DATE NOT NULL,
    title varchar(256) NOT NULL UNIQUE,
    desc TEXT NOT NULL
)`)
.then(result => {
    module.exports = result;
})
.catch(err => console.log(err));