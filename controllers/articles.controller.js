const { sort } = require("../db/data/test-data/articles");
const {
    fetchArticleById,
    fetchAllArticles,
    updateArticleVotesById
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article: article });
        })
        .catch((err) => {
            next(err);
        });
}

exports.getAllArticles = (req, res, next) => {
    const { sort_by, order } = req.query;

    fetchAllArticles(sort_by, order)
        .then((articles) => {
            res.status(200).send({ articles });
        }).catch((err) => {
            next(err);
        });
}

exports.patchArticleVotesById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (typeof inc_votes !== "number") {
        return res.status(400).send({msg: "Invalid input, inc_votes must be a number"})
    }

    updateArticleVotesById(article_id, inc_votes)
        .then((updatedArticle) => {
            res.status(202).send({ article: updatedArticle })
    }).catch((err) => {
        next(err);
    });
}