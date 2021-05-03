const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const db = require('./util/database');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // change it to desired url
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/test', (req, res, next) => {
    console.log('Welcome to the new beginning!!');
    res.send('<h1>Hello from Ayush Sahu</h1>');
});

app.get('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    // Error Handler
    customFormatError(err) {
        if (!err.originalError) {
            return err;
        }
        const data = err.originalError.data || '';
        const message = err.message || 'An error occurred';
        const code = err.originalError.statusCode || 500;
        return {message: message, status: code, data: data};
    }
}));

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || 'Unexpected error';
    const data = error.data;
    res.status(status).json({message: message, data: data, status: status});
})

// app.get('/', (req, res, next) =>  {
//     res.send('<h1>Hello from Ayush Sahu.</h1>');
//     next();
// });

app.listen(3000, () => {
    console.log('Server started successfully!');
});