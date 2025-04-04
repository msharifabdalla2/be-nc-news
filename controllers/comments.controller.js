const { fetchCommentsByArticleId, insertCommentById, removeCommentById } = require("../models/comments.model");

exports.getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params;

    fetchCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch((err) => {
            next(err);
        });
}

exports.postCommentById = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    
    if (!username || !body) {
        return res.status(400).send({ msg: "Missing required fields" });
    }

    insertCommentById(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    removeCommentById(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            next(err);
        });
}