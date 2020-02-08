const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/neo4j');
const Bcrypt = require('bcryptjs');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');
// const test = new QueryBuilder();

//get new user
router.get('/:userName', async (req, res, next) => {
    const userName = req.params.id;

    try {
    const result = await QueryBuilder.getUser(userName);
        await res.status(200).send(result);
    } catch (error) {
        return next(error)
    }
});

//create new user
router.post('/', async (req, res, next) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
        if (typeof userName === "undefined" || typeof password === "undefined" || typeof email === "undefined") {
            next()
        }
        await Regex.emailRegex(email);
        const hash = await Bcrypt.hashSync(password, 8);
        await QueryBuilder.createUser(userName,email,hash);
        const userId = await QueryBuilder.getUserId(userName);
        res.status(200).send({token: await Jwt.encode(email, userId, role)});

    } catch (error) {
        return next(error)
    }
});

module.exports = router;



