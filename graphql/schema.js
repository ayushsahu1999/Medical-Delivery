const {buildSchema} = require('graphql');

module.exports = buildSchema(`

    type Test {
        id: Int!
        reg: String!
    }

    type RootQuery {
        hello(name: String!): Test!
    }

    schema {
        query: RootQuery
    }
`);