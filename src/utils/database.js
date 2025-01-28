const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('src/data/VirtuousData.db');

async function queryDatabase(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function insertDatabase(params = []) {
    const query = `
        INSERT INTO users (
            FullName,
            IndividualID,
            ContactID,
            PhoneNumber,
            Email,
            LastGiftDate,
            LastGiftAmount
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

module.exports = { queryDatabase, insertDatabase };