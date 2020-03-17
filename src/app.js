const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(async function (req, res, next) {
    await res.header("Access-Control-Allow-Origin", "*");
    await res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
    await res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    await next();
});
const UserController = require('./controllers/user.controller');
const BoardController = require('./controllers/board.controller');
const ThreadController = require('./controllers/thread.controller');
const CommentController = require('./controllers/comment.controller');

app.use('/api/user', UserController);
app.use('/api/board', BoardController);
app.use('/api/thread', ThreadController);
app.use('/api/comment', CommentController);

app.all("*", async function (req, res) {
   await res.status(404);
   await res.json({
        description: "Unknown endpoint"
    });
});

app.use((err, req, res, next) => {
    switch (err) {
        case err.message.includes("not found"):
            res.status(404).send({error: err.message});
            break;
        case err.message.includes("token"):
            res.status(401).send({error: err.message});
            break;
        default:
            res.status(422).send({error: err.message});
            break;
    }
});

module.exports = app;
