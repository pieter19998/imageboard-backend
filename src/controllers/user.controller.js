const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/user.queries');
const Bcrypt = require('bcrypt');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

//get new user
router.get('/:username', async (req, res, next) => {
    const username = req.params.username;
    const token = req.header('token');
    try {
        await Jwt.decode(token);
        const result = await QueryBuilder.getUser(username);
        await Regex.checkUndefined([result[0]]);
        const user = await result[0].properties;
        await res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }).end();
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
        await Regex.checkUndefined([username, password, email, role]);
        const hash = Bcrypt.hashSync(password, 10);
        await Regex.emailRegex(email);
        await QueryBuilder.createUser(username, email, hash);
        res.status(200).send().end();

    } catch (error) {
        return next(error)
    }
});

//login user
router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await Regex.checkUndefined([username, password]);
        const result = await QueryBuilder.getUser(username, password);
        if (result[0] !== undefined) {
            const user = await result[0].properties;
            if (await Bcrypt.compareSync(password, user.password)) {
                res.status(200).send({token: await Jwt.encode(username, user.id, user.role)});
            }
            res.status(401).send().end();
        }
        res.status(401).send().end();
    } catch (error) {
        return next(error)
    }
});

//delete user
router.delete('/', async (req, res, next) => {
    const token = req.header('token');
    try {
        const userData = await Jwt.decode(token);
        await console.log(userData.id);
        await QueryBuilder.deleteUser(userData.id);
        res.status(200).send().end();

    } catch (error) {
        return next(error)
    }
});

module.exports = router;
