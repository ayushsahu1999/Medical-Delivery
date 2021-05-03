const User = require('../models/users');
const bcrypt = require('bcrypt');
const db = require('../util/database');
const jwt = require('jsonwebtoken');

module.exports = {

    // creates user
    createUser: async function ({phone, name, address, password}, req) {
        const isPhoneExists = await db.execute('select * from users where mobile=?', [phone]);
        if (isPhoneExists[0][0]) {
            const err = new Error('This mobile already exists');
            err.statusCode = 900;
            throw err;
        }

        const hashedPw = await bcrypt.hash(password, 12);

        const user = await db.execute('INSERT INTO users (name, mobile, location, password) values (?, ?, ?, ?)',
        [name, phone, address, hashedPw]);

        const ret = {
            id: user[0].insertId,
            name: name,
            mobile: phone,
            location: address
        }

        return ret;

    },

    login: async function ({mobile, password}, req) {
        const user = await db.execute('select * from users where mobile=?', [mobile]);
        if (!user[0][0]) {
            const err = new Error('Invalid mobile no.');
            err.statusCode = 900;
            throw err;
        }

        const isEqual = await bcrypt.compare(password, user[0][0].password);
        if (!isEqual) {
            const error = new Error('Username or password incorrect');
            error.statusCode = 900;
            throw error;
        }

        const token = jwt.sign({
            userId: user[0][0].id.toString(),
            name: user[0][0].name
        }, 'somesupersecretsecret', {
            expiresIn: '24h'
        });

        return {token: token, id: user[0][0].id.toString()};
    },

    hello ({name}, req) {
        const i = 4;
        return {
            id: i,
            reg: name
        };
    }
};