const db = require('../util/database');
const result = require('./users');

const Promotion = db.execute(`create table if not exists promocodes (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    expiration_date VARCHAR(10) NOT NULL,
    lCredits INT default 0,
    uCredits INT default 0,
    newUser TINYINT,
    no_of_orders INT,
    code varchar(15) NOT NULL UNIQUE,
    title varchar(256) NOT NULL UNIQUE,
    descrip TEXT
)`)
.then(result => {
    module.exports = result;
})
.catch(err => console.log(err));