const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const db = require('./util/database');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/test', (req, res, next) => {
    console.log('Welcome to the new beginning!!');
    res.send('<h1>Hello from Ayush Sahu</h1>');
});

app.get('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}));

app.get('/', (req, res, next) =>  {
    res.send('<h1>Hello from Ayush Sahu.</h1>');
    next();
});

app.listen(3000, () => {
    console.log('Server started successfully!');
});