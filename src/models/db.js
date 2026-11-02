import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false }
});

export default {
    query: (text, params) => pool.query(text, params)
};