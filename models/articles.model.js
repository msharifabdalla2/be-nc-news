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

exports.fetchAllArticles = (sort_by = "created_at", order = "desc", topic) => {
    
    const validSortColumns = [
        "article_id", "title", "author", "topic",
        "created_at", "votes", "article_img_url", "comment_count"
    ];
    const validOrderValues = ["asc", "desc"];

    if (!validSortColumns.includes(sort_by) && !validOrderValues.includes(order)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid sort_by and order query"
        });
    }
    if (!validSortColumns.includes(sort_by)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid sort_by query"
        });
    }
    if (!validOrderValues.includes(order)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid order query"
        });
    }

    const queryValues = [];
    let SQLTopicFilter = "";

    if (topic) {
        SQLTopicFilter += `WHERE articles.topic = $1`;
        queryValues.push(topic);
    }

    return Promise.all([
        db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]), // Check if topic exists
        db.query(
            `
            SELECT articles.article_id, articles.title, articles.author, articles.topic,
            articles.created_at, articles.votes, articles.article_img_url, 
            COUNT(comments.comment_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            ${SQLTopicFilter}
            GROUP BY articles.article_id
            ORDER BY ${sort_by} ${order.toUpperCase()};
            `,
            queryValues
        )
    ]).then(([topicResult, articlesResult]) => {
        if (topic && topicResult.rows.length === 0) {
            return Promise.reject(
                {
                    status: 404,
                    msg: `No article found for topic: ${topic}`
                }
            );
        }
        return articlesResult.rows;
    });
};

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