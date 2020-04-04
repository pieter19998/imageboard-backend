const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/comment.queries');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

router.get('/thread/:threadId', async (req, res, next) => {
    const threadId = req.params.threadId;
    const token = req.header('token');
    try {
        // await Jwt.decode(token);
        const result = await QueryBuilder.getComments(threadId);
        let thread = [{
            id: result[0].id,
            title: result[0].title,
            text: result[0].text,
            creationDate: result[0].creationDate,
            username: result[0].author[0].username,
        }];
        if (result[0].reply !== undefined) {
            await test(result[0].reply, 0);

            async function test(array, level) {
                let x = [];
                if (array[0] !== undefined) {
                    for (let i = 0; array[i] !== undefined; i++) {
                        if (array[i].status === "1") {
                            x.push({
                                id: array[i].id,
                                text: array[i].text,
                                creationDate: array[i].creationDate,
                                username: array[i].author[0].username,
                                threadId: threadId
                            });
                        }
                    }
                    if (level === 0) {
                        thread[0].reply = x;
                    } else {
                        array[0].reply = x;
                    }
                    if (array[0].reply !== undefined) {
                        await test(array[0].reply, level + 1)
                    }
                }
            }
        }
        await res.status(200).send(thread).end();
    } catch (error) {
        return next(error)
    }
});

router.get('/:id', async (req, res, next) => {
    const token = req.header('token');
    const id = req.params.id;
    try {
        await Jwt.decode(token);
        const result = await QueryBuilder.getComment(id);
        await Regex.checkUndefined([{item: result[0], field: "data"}]);
        const comment = result[0];
        await console.log(comment);
        await res.status(200).send({
            id: comment.id,
            text: comment.text,
            creationDate: comment.creationDate,
            author: comment.author[0].username,
        });
    } catch (error) {
        return next(error)
    }
});

router.post('/threadComment/:thread', async (req, res, next) => {
    const token = req.header('token');
    const thread = req.params.thread;
    const text = req.body.text;
    const image = req.body.image;

    try {
        const user = await Jwt.decode(token);
        await Regex.checkUndefined([{item: text, field: "text"}]);
        await Regex.checkLength([{item: text, length: 250, field: "text"}]);
        await QueryBuilder.createCommentOnThread(text, image, thread, user.id);
        res.status(200).send();

    } catch (error) {
        return next(error)
    }
});

router.post('/:comment', async (req, res, next) => {
    const token = req.header('token');
    const comment = req.params.comment;
    const text = req.body.text;
    const image = req.body.image;

    try {
        const user = await Jwt.decode(token);
        await Regex.checkUndefined([{item: text, field: "text"}]);
        await Regex.checkLength([{item: text, length: 250, field: "text"}]);
        await QueryBuilder.createCommentOnComment(text, image, comment, user.id);
        res.status(200).send();

    } catch (error) {
        return next(error)
    }
});

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const text = req.body.text;
    const image = req.body.image;
    const token = req.header('token');

    try {
        await Jwt.decode(token);
        await Regex.checkUndefined([{item: text, field: text}]);
        await Regex.checkLength([{item: text, length: 240, field: "text"}]);
        await QueryBuilder.updateComment(id, text, image);
        res.status(200).send();
    } catch (error) {
        return next(error)
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    const token = req.header('token');
    try {
        const user = await Jwt.decode(token);
        await Regex.checkUndefined([{item: id, field: "id"}, {item: user.username, field: "username"}]);
        await QueryBuilder.deleteComment(id, user.username);
        res.status(200).send();
    } catch (error) {
        return next(error)
    }
});
module.exports = router;
