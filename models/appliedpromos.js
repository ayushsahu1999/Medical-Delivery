const db = require('../util/database');

const User = db.execute(`create table if not exists appliedpromos (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    orderId INT,
    promoId INT,
    FOREIGN KEY(orderId) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(promoId) REFERENCES promocodes(id) ON DELETE CASCADE ON UPDATE CASCADE
)`)
.then(result => {
    module.exports = result;
})
.catch(err => console.log(err));
