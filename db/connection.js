const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({ path: `${__dirname}/../.env.${ENV}` })

const config = {};

// Check if the environment is production and set up the database configuration
if (ENV === "production") {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL not set for production");
    }
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2; // Limit the number of database connections
} else {
    if (!process.env.PGDATABASE) {
        throw new Error("No PGDATABASE configured");
    }
    console.log(`Connected to ${process.env.PGDATABASE}`);
}

// Create a new Pool with the config (either production or development/test)
const db = new Pool(config);

module.exports = db;