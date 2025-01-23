const express = require('express');
const server = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/VirtuousData.db');
const port = 8080;

function log(message) {
    const currentDate = new Date();
    const formattedDateTime = new Intl.DateTimeFormat('en-US', {
    month: '2-digit', 
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true, 
    }).format(currentDate).replace(',', '');
    console.log(`[${formattedDateTime}] - ${message}`);
}

function queryDatabase(query, params = []) {
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

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => {
    res.render('index');
});

server.get('/handle-call', async (req, res) => {
    let number = req.query.phone_number;

    // Make sure number is valid
    if (number.length != 10) {
        log(`Received an invalid number: ${number}`);
        res.redirect('/');
        return;
    }

    // Format number
    let formatted_number = "(".concat(number.slice(0, 3), ") ", number.slice(3, 6), "-", number.slice(6))
    log(`Received a call from: ${formatted_number}`);

    // Pull data from database
    try {
        const rows = await queryDatabase('SELECT * FROM users WHERE PhoneNumber = ?', [number]);
        if (rows.length > 1) {
            log(`Error: Multiple entries found for ${formatted_number}`);
            log("First result will be returned");
        }
        if (rows.length == 0) {
            log(`No entries found for ${formatted_number}`);
            res.render('handle_call', {phone_number: formatted_number});
            return;
        } else {
            log(`Found user: ${rows[0].FullName}`);
            res.render('handle_call', {phone_number: formatted_number});
            return;
        }
    } catch (err) {
        log(`Error: ${err}`);
        res.render('handle_call', {phone_number: formatted_number});
        return;
    }
});

server.listen(port, () => {
    log(`Server is running on http://localhost:${port}`);
});
