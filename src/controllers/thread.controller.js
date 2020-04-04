const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/thread.queries');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

// get thread by board
router.get('/board/:board', async (req, res, next) => {
    const token = req.header('token');
    const board = req.params.board;

    try {
        // await Jwt.decode(token);
        const result = await QueryBuilder.getThreadsByBoard(board);
        await Regex.checkUndefined([{item: result[0], field: "data"}]);

        const threads = [];

        await test(result[0].reply);

        async function test(array) {
            if (array[0] !== undefined) {
                for (let i = 0; array[i] !== undefined; i++) {
                    if (array[i].status === "1") {
                        threads.push({
                            id: array[i].id,
                            title: array[i].title,
                            text: array[i].text,
                            image: array[i].image,
                            creationDate: array[i].creationDate,
                            username: array[i].author[0].username,
                            board: board
                        });
                    }
                }
            }
        }

        await res.status(200).send(threads);
    } catch (error) {
        return next(error)
    }
});

router.get('/:id', async (req, res, next) => {
    const token = req.header('token');
    const id = req.params.id;
    try {
        // await Jwt.decode(token);
        const result = await QueryBuilder.getThread(id);
        await Regex.checkUndefined([{item: result[0], field: "data"}]);
        const board = result[0];
        await res.status(200).send({
            id: board.id,
            title: board.title,
            text: board.text,
            creationDate: board.creationDate,
            author: board.author[0].username,
        });
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

    try {
        const user = await Jwt.decode(token);
        await Regex.checkUndefined([{item: title, field: "title"} , {item: text, field: text}]);
        await Regex.checkLength([{item: title, length: 25, field:"title"},{item: text, length: 240, field:"text"}]);
        await QueryBuilder.createThread(title, text, image, board, user.id);
        await res.status(200).send().end();
    } catch (error) {
        return next(error)
    }
});

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const title = req.body.title;
    const text = req.body.text;
    const image = req.body.image;
    const token = req.header('token');

    try {
        await Jwt.decode(token);
        await Regex.checkUndefined([{item: title, field: "title"} , {item: text, field: text}]);
        await Regex.checkLength([{item: title, length: 25, field:"title"},{item: text, length: 240, field:"text"}]);
        await QueryBuilder.updateThread(id,title,text);
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
        await Regex.checkUndefined([{item: id, field: "id"} , {item: user.username, field: "username"}]);
        await QueryBuilder.deleteThread(id, user.username);
        res.status(200).send();
    } catch (error) {
        return next(error)
    }
});

module.exports = router;
