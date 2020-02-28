const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/thread.queries');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

//get thread
router.get('/:threadId', async (req, res, next) => {
    const threadId = req.params.threadId;
    const token = req.header('token');
    try {
        await Jwt.decode(token);
        const result = await QueryBuilder.getThread(threadId);
        const thread = await result[0].properties;
        await res.status(200).send({
            id: thread.id,
            title: thread.title,
            text: thread.text,
            image: thread.image,
            creationDate: thread.creationDate
        }).end();
    } catch (error) {
        return next(error)
    }
});

//create thread
router.post('/:board', async (req, res, next) => {
    const token = req.header('token');
    const board = req.params.board;
    const title = req.body.title;
    const text = req.body.text;
    const image = req.body.image;
    const user = await Jwt.decode(token);

    try {
        await Regex.checkUndefined([title, text]);
        await QueryBuilder.createThread(title, text, image, board, user.username);
        await res.status(200).send().end();
    } catch (error) {
        return next(error)
    }
});

router.get('/board/:board', async (req, res, next) => {
    const token = req.header('token');
    const board = req.params.board;

    let list = [];

    try {
        await Jwt.decode(token);
        const result = await QueryBuilder.getThreadsByBoard(board);
        await result[0].created.forEach((item) => {
            console.log(item.status)
            if (item.status === "1") {
                list.push({
                    id: item.id,
                    title: item.title,
                    text: item.text,
                    image: item.image,
                    creationDate: item.creationDate,
                    user: item.author[0].username
                });
            }
        });

        await res.status(200).send(list).end();
    } catch (error) {
        return next(error)
    }
});
module.exports = router;
