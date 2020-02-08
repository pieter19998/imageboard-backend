const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const UserController = require('./controllers/user.controller');

app.use('/api/user', UserController);

app.all("*", function (req, res) {
    res.status(404);
    res.json({
        description: "Unknown endpoint"
    });
});

app.use((err, req, res, next) => {
    res.status(422).send({error: err.message});
});

module.exports = app;
