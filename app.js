const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("../northcoders-news-BE/controllers/topics.controller");
const { handleCustomError, handlePsqlErrors} = require("./errors.controller/errors.controller");
const { getArticleById } = require("./controllers/articles.controller");


app.get("/api", (req, res) => {
    res.status(200).send(endpoints);
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not Found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomError);

module.exports = app;