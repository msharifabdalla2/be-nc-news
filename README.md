# NC News Seeding

NC News - Backend Setup

Project Overview

NC News is a RESTful API that serves articles, comments, topics, and user data for a news website. This repository contains the backend setup, including database seeding and environment configuration.

Setup Instructions

1. Create Environment Variables

This project requires two .env files to connect to the PostgreSQL databases:

.env.development

PGDATABASE=nc_news

.env.test

PGDATABASE=nc_news_test

Note: Ensure that PostgreSQL is installed and running on your machine before proceeding.

2. Install Dependencies

Run the following command to install all required dependencies:

npm install

3. Set Up the Databases

Run the following script to create the development and test databases:

npm run setup-dbs

This will execute the SQL file located at db/setup-dbs.sql to create the necessary databases.

4. Seed the Databases

To populate the development database with sample data, run:

npm run seed

To verify that the seed function is working correctly, run the seed test:

npm run test-seed

5. Running the Tests

To ensure that everything is working as expected, run the full test suite:

npm test

Notes

The .env files are ignored by Git, so make sure to create them manually before running any database-related commands.

If any database-related test fails, ensure that the correct .env file is set up and PostgreSQL is running.

Data Index File Fix

Ensure that your db/data/index.js file properly exports the correct data:

const articleData = require("./articles.js");
const commentData = require("./comments.js");
const topicData = require("./topics.js");
const userData = require("./users.js");

module.exports = { articleData, commentData, topicData, userData };
