const express = require('express');
const server = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('src/data/VirtuousData.db');
const axios = require('axios');
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

function getContactNotes(contactID) {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.virtuoussoftware.com/api/ContactNote/ByContact/${contactID}?sortBy=CreatedDateTime&descending=False&skip=0&take=1`, {
            headers: { 'Authorization': `Bearer ${process.env.VIRTUOUS_TOKN}` }
        })
        .then(response => {
            resolve(response.data.list[0]);
        })
        .catch(error => {
            reject(error);
        });
    });
}

// this needs to be updated to however
function postNewNote(contactID, noteType, noteContent) {
    return new Promise((resolve, reject) => {
        const url = "https://api.virtuoussoftware.com/api/ContactNote";
        data = {
            contactId: contactID,
            type: noteType,
            note: noteContent,
        }
        axios.post(url, data, 
            {headers: {'Authorization': `Bearer ${process.env.VIRTUOUS_TOKN}`, 'Content-Type': 'application/json'}
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}

function cleanNote(note) {
    note.note = note.note.replace(/<\/?[^>]+(>|$)/g, "");
    note.note = note.note.replace(/&nbsp;/g, " ");
}

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => {
    res.render('index');
});

server.post('/new-note', (req, res) => {
    console.log(req.body);
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

    const noteTypes = await queryDatabase('SELECT * FROM noteTypes');

    // Retrieve needed page data
    try {
        const rows = await queryDatabase('SELECT * FROM users WHERE PhoneNumber = ?', [number]);
        if (rows.length > 1) {
            log(`Error: Multiple entries found for ${formatted_number}`);
            log("First result will be returned");
        }
        if (rows.length == 0) {
            log(`No entries found for ${formatted_number}`);
        } else {
            log(`Found user: ${rows[0].FullName}`);
            // Get contact notes
            const note = await getContactNotes(rows[0].ContactID);
            if (note == undefined) {
                log(`No notes found for ${rows[0].FullName}`);
            } else {
                cleanNote(note);
            }
            // Render page with user info
            res.render('handle_call', {phone_number: formatted_number, found_user: true, user: rows[0], note, noteTypes});
            return;
        }
    } catch (err) {
        log(`Error: ${err}`);
    }
    // Render page without user info
    res.render('handle_call', {phone_number: formatted_number, found_user: false, user: null, note: null, noteTypes});
});

server.listen(port, () => {
    log(`Server is running on http://localhost:${port}`);
});
