# 📰 Northcoders News API

A RESTful API for a news aggregation platform, allowing users to retrieve articles, topics, comments, and more.

🌍 Hosted Version: Northcoders News API

## Project Overview

This project is a backend service built with Node.js, Express, and PostgreSQL. It provides endpoints to retrieve, post, update, and delete news-related data such as articles, topics, users, and comments.

## Setup Instructions

### 1️⃣ Clone the Repository

git clone https://github.com/msharifabdalla2/be-nc-news.git
cd be-nc-news

### 2️⃣ Install Dependencies

Ensure you have Node.js v16+ and PostgreSQL v14+ installed, then run:

npm install

### 3️⃣ Set Up Environment Variables

### Create two .env files in the project root:

 ✅ .env.development

PGDATABASE=nc_news

✅ .env.test

PGDATABASE=nc_news_test

✅ Ensure these files are added to .gitignore to prevent exposing credentials.

## Database Setup & Seeding

### 4️⃣ Create the Databases

Run the following command to set up the development and test databases:

npm run setup-dbs

### 5️⃣ Seed the Development Database

npm run seed-dev

## Running Tests

To verify functionality and error handling, run:

npm test

For specific test files:

npm run test-seed
npm run app-test

Running the Server Locally

### 6️⃣ Start the Server

npm start

By default, it will run on port 9090.

## API Endpoints

For a full list of available endpoints and their descriptions, visit:

GET /api

Example:View API Documentation

## Tech Stack

### Backend: Node.js, Express.js

### Database: PostgreSQL, node-postgres (pg)

### Testing: Jest, Supertest

### Hosting: Supabase (DB), Render (API)

## Minimum Requirements

Node.js: v16+

PostgreSQL: v14+