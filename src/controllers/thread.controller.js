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
        let thread = [{
            id: result[0].id,
            title: result[0].title,
            text: result[0].text,
            creationDate: result[0].creationDate,
            username: result[0].author[0].username,
            reply:[]
        }];
        await test(result[0].reply, 0);
        async function test(array, level) {
            let x = [];
            if (array[0] !== undefined) {
                for (let i = 0; array[i] !== undefined; i++) {
                    if (array[i].status === "1") {
                        x.push({id: array[i].id,
                        text: array[i].text,
                        creationDate: array[i].creationDate,
                        username: array[i].author[0].username,
                        reply:[]});
                    }
                }
                thread.push({reply: [x]});
                if (array[0].reply !== undefined) {
                    await test(array[0].reply, level + 1)
                }
            }
        }
        await res.status(200).send(thread).end();
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
