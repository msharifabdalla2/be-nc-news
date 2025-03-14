const db = require("../db/connection");

exports.fetchAllUsers = () => {
    return db
        .query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows;
        });
};

exports.fetchUserByUsername = (username) => {
    if (!isNaN(username)) {
        return Promise.reject(({
            status: 400,
            msg: "Invalid username format"
        }));
    };

    return db
        .query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        )
        .then(({ rows }) => {
            const user = rows[0]
            if (!user) {
                return Promise.reject({
                    status: 404,
                    msg: `No user found with username: ${username}`
                });
            };
            return user;
        });
};