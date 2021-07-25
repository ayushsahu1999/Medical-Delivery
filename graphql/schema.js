const {buildSchema} = require('graphql');

module.exports = buildSchema(`

    type Test {
        id: Int!
        reg: String!
    }

    type User {
        id: ID!
        name: String!
        mobile: String!
        location: String!
    }

    type Resp {
        text: String!
    }

    type RootMutation {
        createUser(phone: String!, name: String!, address: String!, password: String!): User!
        createAgent(name: String!, phone: String!, address: String!): User!
        pickupSchedule(phone: String!, no_of_cases: String): Resp!
        assignAgenttoPickup(order_id: ID!, agent_id: ID!): Resp!
        pickupConfirmed(order_id: ID!): Resp!
        deleteOrder(order_id: ID!): Resp!
        addPromoCode(expiration_date: String!, lCredits: Int, uCredits: Int, newUser: Boolean!, no_of_orders: Int, code: String!, title: String!, desc: String!): Resp!
        applyPromoCode(userId: ID!, orderId: ID!, promoId: ID!): Resp!
        addWorkers(name: String!, mobile: String!, mainId: ID!): Resp!
    }

    type AuthData {
        token: String!
        id: String!
    }

    type Orders {
        order_id: ID!
        destination: String!
        status: String!
    }

    type Promo {
        promoTitle: String!
        promoDesc: String!
    }

    type OrderDetail {
        agent: String!
        destination: String!
        cases: String!
        status: String!
        promoCode: Promo!
    }

    type GetPromoOrders {
        id: ID!
    }

    type RootQuery {
        hello(name: String!): Test!
        login(mobile: String!, password: String!): AuthData!
        workerLogin(mobile: String!): AuthData!
        getOrders(user_id: ID!): [Orders]!
        orderDetail(order_id: ID!): OrderDetail!
        verifyPromoCode(code: String!): Resp!
        getPromoOrders: [GetPromoOrders]!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);