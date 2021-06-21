const express = require('express');
// const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const db = require('./util/database');
const fetch = require('node-fetch');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // change it to desired url
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.get('/send_notif', (req, res, next) => {

    const body = {
        "to":"e0AdCE9lQ5qTmHk-AnWGMv:APA91bEGE4RzGeUcpwpsyWQsxp_pihN_BTSbaWPGtF1W6RxKxUpt-0MtMZ6SNLZNrRqOv1z764VF2TRrF5Ibqa1WUDnZMIDb9QDcITGpO8EUxFnCjv3PhvxwnWmM5APthndnCk9Rh5M2",
        "notification":{
            "body":"This is second notification!!!",
            "title":"Second Message from Ayush"
        }
    };

    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "key=AAAAYmmTyKg:APA91bE7hyrZWtX7do83pnWnYGIk7Wq7vLrlPuuxLi2Gt0ZUbjrrQeJc8K-Q4qSB7_1W8PF2Ql25ocp1YJoZNUthkDD2rqwOHA-2jZMgGvnNy2TS5MNeGX2Ky4P0K7ByMpKoRDc55hRm"
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err))

    res.send('<h1>Hello from Ayush Sahu</h1>');
    next();
});

app.use('/test', (req, res, next) => {
    console.log('Welcome to the new beginning!!');
    res.send('<h1>Hello from Ayush Sahu</h1>');
});

app.use('/graphql', graphqlHTTP({
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