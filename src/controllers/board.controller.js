const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/board.queries');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

router.get('/:name', async (req, res, next) => {
    const token = req.header('token');
    const name = req.params.name;

    try {
        await Jwt.decode(token);
        const result = await QueryBuilder.getBoard(name);
        await Regex.checkUndefined([result[0]]);
        const board = [];

        await test(result[0].reply);
        async function test(array) {
            if (array[0] !== undefined) {
                for (let i = 0; array[i] !== undefined; i++) {
                    if (array[i].status === "1") {
                        board.push({
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
        await res.status(200).send(board);
    } catch (error) {
        return next(error)
    }
});

router.get('/', async (req, res, next) => {
    const token = req.header('token');

    try {
        let board = [];
        await Jwt.decode(token);
        const result = await QueryBuilder.getBoards();
        await result.forEach((item) => {
            board.push({
                id: item.properties.id,
                name: item.properties.name,
                description: item.properties.description,
                creationDate: item.properties.creationDate
            });
        });

        await res.status(200).send(board);
    } catch (error) {
        return next(error)
    }
});

router.post('/', async (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const token = req.header('token');

    try {
        const user = await Jwt.decode(token);
        await Regex.checkUndefined([name, description]);
        await QueryBuilder.creatBoard(name, description, user.id);
        res.status(200).send();
    } catch (error) {
        return next(error)
    }
});

module.exports = router;
