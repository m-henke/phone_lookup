const { getNoteTypes } = require('../utils/virtuous');
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

async function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
          if (err) reject(err);
          else resolve(this);
        });
    });
}

async function updateNoteTypes() {
    await runQuery("DROP TABLE IF EXISTS noteTypes");
    let types = await getNoteTypes();
    types = Object.values(types).map(value => [value]);
    await runQuery("CREATE TABLE IF NOT EXISTS noteTypes (NoteType TEXT NOT NULL)");
    for (let i = 0; i < types.length; i++) {
        await runQuery("INSERT INTO noteTypes (NoteType) VALUES(?)", types[i]);
    }
}

module.exports = { queryDatabase, insertDatabase, updateNoteTypes };