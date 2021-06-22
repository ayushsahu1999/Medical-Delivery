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
        addPromoCode(code: String!): Resp!
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

    type OrderDetail {
        agent: String!
        destination: String!
        cases: String!
        status: String!
    }

    type RootQuery {
        hello(name: String!): Test!
        login(mobile: String!, password: String!): AuthData!
        getOrders(user_id: ID!): [Orders]!
        orderDetail(order_id: ID!): OrderDetail!
        verifyPromoCode(code: String!): Resp!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);