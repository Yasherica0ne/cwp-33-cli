const router = require('express').Router();

function getCommitRouter(context) {
    router.get('/', (req, res, next) => {
        try {
            req.ability.throwUnlessCan('read', 'Commit');

            const commits = context.commits.filter(n => n.repoId == req.repoId);

            res.send(commits);
        } catch (error) {
            next(error);
        }
    });

    router.post('/', (req, res, next) => {
        try {
            //const repo = context.repos.filter(n => n.repoId == req.repoId);

            req.ability.throwUnlessCan('update', 'Repo');
            req.ability.throwUnlessCan('create', 'Commit');

            req.body.repoId = req.repoId;

            const commit = req.body;
            commit.id = context.commits[context.commits.length - 1].id + 1;
            context.commits.push(commit);

            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id', (req, res, next) => {
        try {
            req.ability.throwUnlessCan('read', 'Commit');

            const commit = context.commits.filter(n => n.id == req.params.id && n.repoId == req.repoId).pop();

            if (commit) {
                res.send(commit);
            } else {
                res.status(404).send('Commit doesn\'t exist');
            }
        } catch (error) {
            next(error);
        }
    });

    router.put('/:id', (req, res, next) => {
        try {
            const commit = context.commits.filter(n => n.id == req.params.id && n.repoId == req.repoId).pop();

           // const repo = context.repos.filter(n => n.repoId == req.repoId).pop();

            req.ability.throwUnlessCan('update', 'Repo');
            req.ability.throwUnlessCan('update', 'Commit');

            context.commits = context.commits.filter(n => n.id != commit.id);
            context.commits.push(req.body);

            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/:id', (req, res, next) => {
        try {
            req.ability.throwUnlessCan('delete', 'Commit');

            context.commits = context.commits.filter(n => n.id != req.params.id);

            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    });

    return router;
}

module.exports = getCommitRouter;