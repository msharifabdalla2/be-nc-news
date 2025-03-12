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

exports.insertCommentById = (article_id, username, body) => {

    return Promise.all([
        db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]),
        db.query(`SELECT * FROM users WHERE username = $1`, [username])
    ])
        .then(([articleResult, userResult]) => {
            if (articleResult.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No article found for article_id: ${article_id}`
                });
            }
            if (userResult.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Username not found"
                });
            }
            return db.query(
                `INSERT INTO comments (article_id, author, body)
                VALUES ($1, $2, $3)
                RETURNING *;`,
                [article_id, username, body]
            );
        })
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.removeCommentById = (comment_id) => {
    return db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
        [comment_id]
    )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No comment found for comment_id: ${comment_id}`
                });
            };
        });
}