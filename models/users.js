const db = require('../util/database');

const User = db.execute(`create table if not exists users (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name varchar(256) NOT NULL,
    mobile varchar(10) NOT NULL UNIQUE,
    location varchar(256),
    password varchar(256) NOT NULL,
    credits INT default 0
)`)
.then(result => {
    module.exports = result;
})
.catch(err => console.log(err));


// add credits
// make location field to another table with foreign key of user id