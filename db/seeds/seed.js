const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, formatCommentsData } = require("./utils")


const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    }).then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return createTopics();
    })
    .then(() => {
      return createUsers();
    }).then(() => {
      return createArticles();
    }).then(() => {
      return createComments();
    }).then(() => {
      return insertTopicsData(topicData);
    }).then(() => {
      return insertUsersData(userData);
    }).then(() => {
      return insertArticlesData(articleData);
    }).then(({ rows }) => {
      // rows is article data when destructured
      // console.log(rows)
      insertCommentsData(commentData, rows);
    })
};


async function createTopics() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS topics (
    slug VARCHAR(255) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    img_url VARCHAR(1000) NOT NULL
    );
  `);
}

async function createUsers() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL
    );
  `);
}

async function createArticles() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) REFERENCES topics(slug) ON DELETE CASCADE,
    author VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
    );
  `);
}

async function createComments() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function insertTopicsData(data) {
  const formattedTopicsData = data.map((topic) => {
    return [topic.slug, topic.description, topic.img_url];
  });

  const sqlString = format(
    "INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *",
    formattedTopicsData
  );
  return db.query(sqlString);
}

function insertUsersData(data) {
  const formattedUsersData = data.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });

  const sqlString = format(
    "INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *",
    formattedUsersData
  );
  return db.query(sqlString);
}

function insertArticlesData(data) {
  const formattedArticlesData = data.map((article) => {
    const convertedObjectWithTimes = convertTimestampToDate(article);
    // console.log(convertedObjectWithTimes);
    return [
      convertedObjectWithTimes.created_at,
      convertedObjectWithTimes.title,
      convertedObjectWithTimes.topic,
      convertedObjectWithTimes.author,
      convertedObjectWithTimes.body,
      convertedObjectWithTimes.votes,
      convertedObjectWithTimes.article_img_url
    ];
  });

  // console.log(formattedArticlesData);
  
  const sqlString = format(
    "INSERT INTO articles (created_at, title, topic, author, body, votes, article_img_url) VALUES %L RETURNING *",
    formattedArticlesData
  );
  return db.query(sqlString);
}

function insertCommentsData(commentData, articleData) {
  const commentsData = formatCommentsData(commentData, articleData)
  const formattedCommentsData = commentsData.map((comment) => {
    return Object.values(comment)
  });
  // console.log(formattedCommentsData)
  const sqlString = format(`INSERT INTO comments (created_at, body, votes, author, article_id) VALUES %L RETURNING *`,
    formattedCommentsData
  );
  return db.query(sqlString);
}

// CREATE TABLE IF NOT EXISTS comments (
//   comment_id SERIAL PRIMARY KEY,
//   article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
//   body TEXT NOT NULL,
//   votes INT DEFAULT 0,
//   author VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

module.exports = seed;
