const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/thread.queries');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

//get thread by board
router.get('/:board', async (req, res, next) => {
    const token = req.header('token');
    const board = req.params.board;

    try {
        await Jwt.decode(token);
        const result = await QueryBuilder.getThreadsByBoard(board);
        await Regex.checkUndefined([result[0]]);
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
                            username: array[i].author[0].username
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

//create thread
router.post('/:board', async (req, res, next) => {
    const token = req.header('token');
    const board = req.params.board;
    const title = req.body.title;
    const text = req.body.text;
    const image = req.body.image;

    try {
        const user = await Jwt.decode(token);
        await Regex.checkUndefined([title, text]);
        await QueryBuilder.createThread(title, text, image, board, user.id);
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

        await result.forEach((item) => {
            list.push({
                id: item.properties.id,
                title: item.properties.title,
                text: item.properties.text,
                image: item.properties.image,
                creationDate: item.properties.creationDate
            });
        });

        await res.status(200).send(list).end();
    } catch (error) {
        return next(error)
    }
});
module.exports = router;
