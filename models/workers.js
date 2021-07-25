const db = require('../util/database');

const Worker = db.execute(`create table if not exists workers (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    mainId INT NOT NULL,
    FOREIGN KEY(mainId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(10) NOT NULL UNIQUE
)`)
.then(result => {
    module.exports = result;
})
.catch(err => console.log(err));