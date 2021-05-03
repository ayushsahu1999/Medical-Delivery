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
        pickupSchedule(phone: String!, no_of_cases: Int): Resp!
    }

    type AuthData {
        token: String!
        id: String!
    }

    type RootQuery {
        hello(name: String!): Test!
        login(mobile: String!, password: String!): AuthData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);