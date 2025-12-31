import sqlite3 from 'sqlite3';
import { env } from '$env/dynamic/private';
import path from 'path';

const verbose = sqlite3.verbose();

// Use DATABASE_FILE env or default to local leads.db
const DB_PATH = env.DATABASE_FILE || path.resolve('leads.db');

const db = new verbose.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Failed to connect to SQLite database:', err.message);
    }
});

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.run(CREATE_TABLE_SQL, (err) => {
    if (err) {
        console.error('Failed to initialize database schema:', err.message);
    }
});

export function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

export default db;
