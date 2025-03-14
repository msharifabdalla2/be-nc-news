const articlesRouter = require("express").Router();
const { getArticleById, getAllArticles, patchArticleVotesById } = require("../controllers/articles.controller");
const { getArticleCommentsById, postCommentById } = require("../controllers/comments.controller")


articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleCommentsById);
articlesRouter.post("/:article_id/comments", postCommentById);
articlesRouter.patch("/:article_id", patchArticleVotesById);


module.exports = articlesRouter;