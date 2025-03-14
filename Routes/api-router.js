const apiRouter = require("express").Router();
const endpoints = require("../endpoints.json");

const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);


apiRouter.get("/", (req, res) => {
    res.status(200).send(endpoints);
});

module.exports = apiRouter;