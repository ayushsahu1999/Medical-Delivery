const db = require('../util/database');

const Order = db.execute(`create table if not exists orders (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userId INT,
    agentId INT,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(agentId) REFERENCES agents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    destination varchar(256),
    no_of_cases varchar(100) default '',
    status INT DEFAULT 0,
    date_of_conf varchar(10),
    date_of_del varchar(10)
)`)
.then(result => {
    module.exports = result;
})
.catch(err => console.log(err));

// status = 0->pickup, 1->on the way, 2->en route, 3-> delivered