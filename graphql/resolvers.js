const Users = require('../models/users');
const Agents = require('../models/agents');
const Orders = require('../models/orders');
const Workers = require('../models/workers');
const Locations = require('../models/locations');
const Promotions = require('../models/promotions');
const AppliedPromos = require('../models/appliedpromos');

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

    createAgent: async function({ name, phone, address }, req) {
        const ag = await db.execute('select * from agents where mobile=?', [phone]);
        if (ag[0][0]) {
            const err = new Error('Agent already exists!!');
            err.statusCode = 900;
            throw err;
        }

        const agent = await db.execute('insert into agents (name, mobile, location) values (?, ?, ?)',
        [name, phone, address]);

        const ret = {
            id: agent[0].insertId,
            name: name,
            mobile: phone,
            location: address
        }

        return ret;
    },

    pickupSchedule: async function({ phone, no_of_cases }, req) {

        const user = await db.execute('select * from users where mobile=?', [phone]);
        if (!user[0][0]) {
            const err = new Error('Invalid phone number');
            err.statusCode = 900;
            throw err;
        }

        const order = await db.execute('insert into orders (userId, no_of_cases) values (?, ?)', [user[0][0].id, no_of_cases]);

        return {text: order[0].insertId};

    },

    deleteOrder: async function({order_id}, req) {
        const order = await db.execute('select id from orders where id=?', [order_id]);
        if (!order[0][0]) {
            const err = new Error('Invalid Order!');
            err.statusCode = 900;
            throw err;
        }

        // Use Socket.IO
        await db.execute('delete from orders where id=?', [order_id]);

        return {text: 'Order deleted successfully!'}
    },

    addWorkers: async function({name, mobile, mainId}, req) {
        
        if (mobile.length !== 10) {
            const err = new Error('Invalid mobile number');
            err.statusCode = 900;
            throw err;
        }

        const main = await db.execute('select id from users where id=?', [mainId]);
        if (!main[0][0]) {
            const err = new Error('Wrong main id');
            err.statusCode = 900;
            throw err;
        }

        try {
            
            await db.execute('insert into workers (mainId, name, mobile) values (?, ?, ?)', [mainId, name, mobile]);

        } catch (error) {
            const err = new Error('Something went wrong!');
            err.statusCode = 900;
            throw err;
        }

    },

    addPromoCode: async function({expiration_date, lCredits, uCredits, newUser, no_of_orders, code, title, desc}, req) {

        if (code.slice(0, 8) !== "DISCOUNT" && code.slice(0, 8) !== "CASHBACK") {
            const err = new Error('Invalid code');
            err.statusCode = 900;
            throw err;
        }

        var resp = 'Code added successfully!';
        try {
            await db.execute('insert into promocodes (expiration_date, lCredits, uCredits, newUser, no_of_orders, code, title, desc) values (?, ?, ?, ?, ?, ?, ?, ?)', 
            [expiration_date, lCredits, uCredits, newUser, no_of_orders, code, title, desc]);
        } catch (error) {
            resp = 'Invalid Promo Code.'
        }

        return {text: resp};
    },

    assignAgenttoPickup: async function ({ order_id, agent_id }, req) {
        const order = await db.execute('select * from orders where id=? and status=?', [order_id, 0]);
        if (!order[0][0]) {
            const err = new Error('No such order exists.');
            err.statusCode = 401;
            throw err;
        }

        await db.execute('update orders set agentId=?, status=? where id=?', [agent_id, 1, order_id]);

        // send the notification to the user.

        return {text: 'Successful'}
    },

    pickupConfirmed: async function ({ order_id }, req) {
        const order = await db.execute('select * from orders where id=? and status=?', [order_id, 1]);
        if (!order[0][0]) {
            const err = new Error('Cannot find this order.');
            err.statusCode = 900;
            throw err;
        }

        await db.execute('update orders set status=? where id=?', [2, order[0][0].id]);

        return {text: 'Success'};
    },

    applyPromoCode: async function ({userId, orderId, promoId}, req) {
        const user = await db.execute('select id, credits from users where id=?', [userId]);
        if (!user[0][0]) {
            const err = new Error('Invalid user id');
            err.statusCode = 900;
            throw err;
        }

        const promo = await db.execute('select * from promocodes where id=?', [promoId]);
        if (!promo[0][0]) {
            const err = new Error('Invalid promo code.');
            err.statusCode = 900;
            throw err;
        }

        const today = new Date();
        const expiration_date = new Date(promo[0][0].expiration_date);

        if (today > expiration_date) {
            const err = new Error('Invalid promo code.');
            err.statusCode = 900;
            throw err;
        }

        const lCred = promo[0][0].lCredits;
        const uCred = promo[0][0].uCredits;

        if (lCred || uCred) {
            if (user[0][0].credits > uCred && user[0][0].credits < lCred) {
                const err = new Error('Invalid promo code.');
                err.statusCode = 900;
                throw err;
            }
        }

        if (promo[0][0].newUser || promo[0][0].no_of_orders) {
            const orders = await db.execute('select count(userId) from orders where userId=?', [userId]);
            if (orders > 0) {
                const err = new Error('Invalid promo code.');
                err.statusCode = 900;
                throw err;
            }

            if (orders < no_of_orders) {
                const err = new Error('Invalid promo code.');
                err.statusCode = 900;
                throw err;
            }
        }

        // Insert into table with relationship of orders and promo codes
        await db.execute('insert into appliedpromos (orderId, promoId) values (?, ?)', [orderId, promo[0][0].id]);

        return {text: "Promo Code Applied Successfully"};

    },

    login: async function ({mobile, password}, req) {
        console.log('mobile, password');
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

    workerLogin: async function({mobile}, req) {
        const worker = await db.execute('select * from workers where mobile=?', [mobile]);
        if (!worker[0][0]) {
            const err = new Error('Invalid mobile number');
            err.statusCode = 900;
            throw err;
        }

        const mainId = worker[0][0].mainId;
        const main = await db.execute('select id from users where id=?', [mainId]);

        const token = jwt.sign({
            userId: worker[0][0].id.toString(),
            name: worker[0][0].name
        }, 'somesupersecretsecret', {
            expiresIn: '24h'
        });

        // the id should be of the main id
        return {token: token, id: main[0][0].id.toString()};
    },

    verifyPromoCode: async function({code}, req) {
        const promo = await db.execute('select * from promocodes where code=?', [code]);
        if (!promo[0][0]) {
            const error = new Error('Invalid promo code.');
            error.statusCode = 900;
            throw error;
        }

        return {text: 'Promo Code applied successfully!'};
    },

    getOrders: async function({user_id}, req) {
        const user = await db.execute('select name from users where id=?', [user_id]);
        if (!user[0][0]) {
            const err = new Error("cannot find this user.");
            err.statusCode = 900;
            throw err;
        }

        const orders = await db.execute('select * from orders where userId=?', [user_id]);
        
        const ret = orders[0].map(order => {
            return {
                order_id: order.id,
                destination: order.destination || "",
                status: order.status
            }
        });

        // console.log(ret);
        return ret;
    },

    orderDetail: async function({order_id}, req) {
        
        const order = await db.execute('select * from orders where id=?', [order_id]);
        if (!order[0][0]) {
            const err = new Error("cannot find this order.");
            err.statusCode = 900;
            throw err;
        }

        const agent = undefined;
        if (order[0][0].agentId) {
            const ag = await db.execute('select name from agents where id=?', [order[0][0].agentId]);
            if (!ag[0][0]) {
                const err = new Error("This agent does not exist");
                err.statusCode = 900;
                throw err;
            }
            agent = ag[0][0].name;
        }

        var status;
        if (order[0][0].status == 0) {
            status = 'Scheduled for pickup'
        } else if (order[0][0].status == 1) {
            status = 'Picked up successfully'
        } else if (order[0][0].status == 2) {
            status = 'En Route'
        } else if (order[0][0].status == 3) {
            status = 'Delivered Successfully'
        } else {
            status = 'Cancelled'
        }

        var promTitle, promDesc;

        const prom = await db.execute(`select promo.title, promo.desc from appliedpromos app inner join
                    promocodes promo on app.promoId=promo.id and app.orderId=?`, [order_id]);

        if (!prom[0][0]) {
            promTitle = "null";
            promDesc = "null";
        } else {
            promTitle = prom[0][0].title;
            promDesc = prom[0][0].desc;
        }

        return {
            agent: agent || "Processing",
            destination: order[0][0].destination || "Processing",
            cases: order[0][0].no_of_cases || "Not specified",
            status: status,
            promoCode: {
                promoTitle: promTitle,
                promoDesc: promDesc
            }
        }
    },

    hello ({name}, req) {
        const i = 4;
        return {
            id: i,
            reg: name
        };
    }
};