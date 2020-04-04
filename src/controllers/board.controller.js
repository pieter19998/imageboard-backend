const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/board.queries');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

router.get('/:name', async (req, res, next) => {
    const token = req.header('token');
    const name = req.params.name;
    try {
        // await Jwt.decode(token);
        const result = await QueryBuilder.getBoard(name);
        await Regex.checkUndefined([{item: result[0], field: "result"}]);
        const board = result[0];
        await res.status(200).send({
            id: board.id,
            name: board.name,
            description: board.description,
            creationDate: board.creationDate,
            author: board.author[0].username,
        });
    } catch (error) {
        return next(error)
    }
});

router.get('/', async (req, res, next) => {
    // const token = req.header('token');
    try {
        let board = [];
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
        if (user.role !== "admin"){
            res.status(401).send({error: "only an admin is create a board"}).end();
        }
        else {
            await Regex.checkUndefined([{item: name, field: "name"}, {item: description, field: "description"}]);
            await Regex.checkLength([{item: name, length: 25, field: "name"}, {
                item: description,
                length: 100,
                field: "description"
            }]);
            await QueryBuilder.creatBoard(name, description, user.id);
            res.status(200).send();
        }
    } catch (error) {
        return next(error)
    }
});

router.put('/', async (req, res, next) => {
    const name = req.body.name;
    const newName = req.body.newName;
    const description = req.body.description;
    const token = req.header('token');

    try {
        const user = await Jwt.decode(token);
        if (user.role !== "admin"){
            res.status(401).send({error: "only admin is allow to edit board data"}).end();
        }
        else {
            await Regex.checkUndefined([{item: name, field: "name"}, {
                item: newName,
                field: "newName"
            }, {item: description, field: "description"}]);
            await Regex.checkLength([{item: newName, length: 25, field: "name"}, {
                item: description,
                length: 100,
                field: "description"
            }]);
            await QueryBuilder.updateBoard(name, newName, description);
            res.status(200).send();
        }
    } catch (error) {
        return next(error)
    }
});

router.delete('/:name', async (req, res, next) => {
    const name = req.params.name;
    const token = req.header('token');
    try {
        const user = await Jwt.decode(token);
        if (user.role !== "admin"){
            res.status(401).send({error: "only an admin is allow to delete a board "}).end();
        }
        else {
            await Regex.checkUndefined([{item: name, field: "name"}]);
            await QueryBuilder.deleteBoard(name);
            res.status(200).send();
        }
    } catch (error) {
        return next(error)
    }
});

module.exports = router;
