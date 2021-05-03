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

    type RootMutation {
        createUser(phone: String!, name: String!, address: String!, password: String!): User!
    }

    type RootQuery {
        hello(name: String!): Test!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);