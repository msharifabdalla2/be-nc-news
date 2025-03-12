const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("../northcoders-news-BE/controllers/topics.controller");
const { handleCustomError, handlePsqlErrors} = require("./errors.controller/errors.controller");
const { getArticleById, getAllArticles, patchArticleVotesById } = require("./controllers/articles.controller");
const { getArticleCommentsById, postCommentById, deleteCommentById } = require("./controllers/comments.controller")
const{ getAllUsers } = require("./controllers/users.controller")
app.use(express.json());


app.get("/api", (req, res) => {
    res.status(200).send(endpoints);
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.post(`/api/articles/:article_id/comments`, postCommentById);

app.patch('/api/articles/:article_id', patchArticleVotesById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllUsers);


app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not Found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomError);

module.exports = app;