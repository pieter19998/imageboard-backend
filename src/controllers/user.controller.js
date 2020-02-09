const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/neo4j');
const Bcrypt = require('bcryptjs');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

//get new user
router.get('/:username', async (req, res, next) => {
    const username = req.params.username;
    try {
    const result = await QueryBuilder.getUser(username);
        await res.status(200).send(result.properties);
    } catch (error) {
        return next(error)
    }
});

//create new user
router.post('/', async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
        await Regex.checkUndefined([username,password,email,role]);
        await Regex.emailRegex(email);
        const hash = await Bcrypt.hashSync(password, 8);
        await QueryBuilder.createUser(username,email,hash);
        res.status(200).send();

    } catch (error) {
        return next(error)
    }
});

//login user
router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await Regex.checkUndefined([username,password]);
        const user = await QueryBuilder.login(username, password);
        const userId = await QueryBuilder.getUserId(username);
        res.status(200).send({token: await Jwt.encode(username, userId, user.properties.role)});

    } catch (error) {
        return next(error)
    }
});

//delete user
router.delete('/', async (req, res, next) => {
    const userData = await Jwt.decode(req.headers.token);try {
        await QueryBuilder.deleteUser(userData.username);
        res.status(200).send();

    } catch (error) {
        return next(error)
    }
});

module.exports = router;
