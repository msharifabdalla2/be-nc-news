const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
    return db
        .query(
            `SELECT * FROM articles WHERE article_id = $1`, [article_id]
    ).then(({ rows }) => {
            const article = rows[0];
            if (!article) {
                return Promise.reject({
                    status: 404,
                    msg: `No article found for article_id: ${article_id}`
                })
            }
        return article;
    })
}

exports.fetchArticles = () => {
    return db.query(
        `
        SELECT articles.article_id, articles.title, articles.author, articles.topic,
        articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
        `
    ).then(({ rows }) => {
        return rows;
    });
}

exports.updateArticleVotesById = (article_id, inc_votes) => {
    return db.query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [inc_votes, article_id]
    )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No article found for article_id: ${article_id}`
                })
            }
            return rows[0];
        });
}