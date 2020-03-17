const express = require('express');
const router = express.Router();
const QueryBuilder = require('../../queryBuilder/comment.queries');
const Jwt = require('../../helpers/jwt');
const Regex = require('../../helpers/regex');

router.get('/:id', async (req, res, next) => {
    const token = req.header('token');
    const id = req.params.id;

    try {
        await Jwt.decode(token);
        const result = await QueryBuilder.getComment(id);
        await Regex.checkUndefined([result[0]]);
        const board = result[0].properties;
        await res.status(200).send({
            id: board.id,
            name: board.name,
            description: board.description,
            creationDate: board.creationDate
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
        await Regex.checkUndefined([text]);
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
        await Regex.checkUndefined([text]);
        await QueryBuilder.createCommentOnComment(text, image, comment, user.id);
        res.status(200).send();

    } catch (error) {
        return next(error)
    }

});
module.exports = router;
