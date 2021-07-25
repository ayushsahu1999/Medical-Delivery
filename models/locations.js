const db = require('../util/database');

const User = db.execute(`create table if not exists locations (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userId INT,
    location TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
)`)
.then(result => {
    module.exports = result;
})
.catch(err => console.log(err));
