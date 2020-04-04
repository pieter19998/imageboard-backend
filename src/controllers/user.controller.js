const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/user.queries');
const Bcrypt = require('bcrypt');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');
const uuid = require("uuid");


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

router.get('/', async (req, res, next) => {
    const token = req.header('token');
    console.log(token);
    try {
        const username = await Jwt.decode(token);
        const result = await QueryBuilder.getUser(username.username);
        await Regex.checkUndefined([{item : result[0]}]);
        const user = await result[0].properties;
        await res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth
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
    const gender = req.body.gender;
    const dateOfBirth = req.body.dateOfBirth;
    const id = uuid.v4();
    try {
        await Regex.checkUndefined([{item: username, field:"username"},{item: password, field:"password"},{item: email, field:"email"},{item: role, field:"role"},{item: gender, field:"gender"},{item: dateOfBirth, field:"dateOfBirth"}]);
        await Regex.checkLength([{item: username, length: 25, field:"username"},{item: password, length: 20, field:"password"},{item: email, length: 100, field:"email"}]);
        const hash = Bcrypt.hashSync(password, 10);
        await Regex.emailRegex(email);
        await QueryBuilder.createUser(username, email, hash, id, gender, dateOfBirth,role);
        res.status(200).send({token: await Jwt.encode(username, id, role)});

    } catch (error) {
        return next(error)
    }
});

//login user
router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await Regex.checkUndefined([{item: username, field:"username"},{item: password, field:"password"}]);
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

router.put('/', async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const gender = req.body.gender;
    const dateOfBirth = req.body.dateOfBirth;
    const role = req.body.role;
    const token = req.header('token');

    try {
        const user = await Jwt.decode(token);
        await Regex.checkUndefined([{item: username, field:"username"}, {item: email, field:"email"}, {item: gender, field:"gender"}, {item: dateOfBirth, field:"dateOfBirth"}]);
        await Regex.checkLength([{item: username, length: 25, field:"username"},{item: email, length: 100, field:"email"}]);
        await Regex.emailRegex(email);
        await QueryBuilder.updateUser(username, email, user.id, gender, dateOfBirth,role);
        res.status(200).send();
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
