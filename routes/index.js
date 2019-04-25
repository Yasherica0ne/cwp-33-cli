const router = require('express').Router();
const getRepoRouter = require('./repo');

function getRouter(context) {
    const repoRouter = getRepoRouter(context);

    router.use('/repos', repoRouter);

    router.use('/ability', (req, res) => {
        res.send(req.ability.rules);
    });
    
    return router;
}

module.exports = getRouter;