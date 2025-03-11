const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return Promise.all([
        db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]),
        db.query(
            `SELECT comment_id, votes, created_at, author, body, article_id
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC;`,
            [article_id]
        )
    ])
        .then(([articleResult, commentResult]) => {
            if (articleResult.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No article found for article_id: ${article_id}`
                });
            }
        return commentResult.rows
    })
};