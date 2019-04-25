const router = require('express').Router();
const getCommitRouter = require('./commit');

function getRouter(context) {
    const commitRouter = getCommitRouter(context);

    router.get('/', (req, res, next) => {
        try {
            req.ability.throwUnlessCan('read', 'Repo');

            const repos = context.repos;

            res.send(repos);
        } catch (error) {
            next(error);
        }
    });

    router.post('/', (req, res, next) => {
        try {
            req.ability.throwUnlessCan('create', 'Repo');

            const repo = req.body;
            repo.id = context.repos[context.repos.length - 1].id + 1;
            context.repos.push(repo);

            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    });

    router.param('id', (req, res, next) => {
        const repoId = Number.parseInt(req.params.id);

        if (!isNaN(repoId)) {
            const repo = context.repos.filter(n => n.id == repoId).pop();

            if (repo) {
                req.repoId = repoId;
                next();
            } else {
                res.status(404).send('Repo doesn\'t exist');
            }

        } else {
            res.status(400).send('Id is invalid');
        }
    });

    router.get('/:id', (req, res, next) => {
        try {
            req.ability.throwUnlessCan('read', 'Repo');

            const repo = context.repos.filter(n => n.id == req.params.id).pop();

            res.send(repo);
        } catch (error) {
            next(error);
        }
    });

    router.put('/:id', (req, res, next) => {
        try {
            //const repo = context.repos.filter(n => n.id == req.params.id);

            req.ability.throwUnlessCan('update', 'Repo');

            context.repos = context.repos.filter(n => n.id != req.params.id);
            context.repos.push(req.body);

            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/:id', (req, res, next) => {
        try {
            req.ability.throwUnlessCan('delete', 'Repo');

            context.commits = context.repos.filter(n => n.id != req.params.id);

            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    });

    router.use('/:id/commits', commitRouter);

    return router;
}

module.exports = getRouter;