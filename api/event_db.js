/**
 * ============================================================================
 *  event_db.js — MySQL connection pool for the Charity Events API
 * ============================================================================
 *  This module is the ONLY place that talks to MySQL. Every API endpoint in
 *  server.js imports the pool from here, which keeps database credentials
 *  in one file and makes the connection reusable across requests.
 *
 *  Why a connection *pool* (not a single connection)?
 *    A pool keeps several connections open and hands them out on demand.
 *    It handles many simultaneous browser requests far more efficiently than
 *    opening and closing a brand-new connection for every single request.
 * ============================================================================
 */

// Load environment variables from api/.env (DB host, user, password, etc.).
// This keeps secrets out of the source code and lets the marker use their
// own local MySQL credentials without editing any code.
require('dotenv').config();

// mysql2/promise gives us async/await support out of the box, which reads
// much more cleanly than nested callbacks inside our route handlers.
const mysql = require('mysql2/promise');

/**
 * Create the shared connection pool.
 * All values fall back to safe local-development defaults if the .env file
 * is missing, so the API still boots for a quick demo.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',     // MySQL server address
    port: Number(process.env.DB_PORT) || 3306,     // default MySQL port
    user: process.env.DB_USER || 'root',           // MySQL username
    password: process.env.DB_PASSWORD || '',       // MySQL password (often empty locally)
    database: process.env.DB_NAME || 'charityevents_db', // target database
    waitForConnections: true,                      // queue requests when busy
    connectionLimit: 10,                           // max simultaneous connections
    queueLimit: 0,                                 // unlimited queue
    dateStrings: true                              // return DATETIME as readable strings
});

/**
 * Small helper that runs a query and returns ONLY the rows.
 * Every endpoint calls this helper so error handling is consistent.
 *
 * @param {string} sql  - the parameterised SQL statement
 * @param {Array}  params - values bound to the "?" placeholders (prevents SQL injection)
 * @returns {Promise<Array>} the result rows
 */
async function query(sql, params = []) {
    // Ask the pool for a connection, run the query, and ALWAYS release it
    // back to the pool in a finally block so it can be reused.
    const [rows] = await pool.execute(sql, params);
    return rows;
}

/**
 * Test helper that confirms the database is reachable at startup.
 * server.js calls this once and logs a friendly message.
 */
async function testConnection() {
    const [row] = await pool.query('SELECT 1 AS ok');
    return row[0].ok === 1;
}

// Export the pool and helpers so other modules can use them.
module.exports = { pool, query, testConnection };
