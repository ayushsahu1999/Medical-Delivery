const db = require('../util/database');

const Agent = db.execute(`create table if not exists agents (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name varchar(256) NOT NULL,
    mobile varchar(10) NOT NULL UNIQUE,
    location varchar(256)
)`)
.then(result => {
    module.exports = result;
})
.catch(err => console.log(err));