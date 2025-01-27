const { log, queryDatabase, getContactNotes, postNewNote, searchForContact, cleanNote } = require('./server_functions');
const express = require('express');
const path = require('path');
const server = express();
const port = 8080;

// Setup view engine and static files
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.json());

// Route for home page where user can input a number
server.get('/', (req, res) => {
    res.render('index');
});

// Route for handling new note submission
server.post('/new-note', async (req, res) => {
    postNewNote(req.body.contactId, req.body.type, req.body.note).then(response => {
        log(`Note added successfully for: ${req.body.contactId}`);
        res.json({
            success: true
        });
    }).catch(error => {
        log(`Failed to add note for: ${req.body.contactId}`);
        res.json({
            success: false
        });
    });
});

server.get('/handle-call', async (req, res) => {
    let number = req.query.phone_number;
    if (number.length != 10) {
        log(`Received an invalid number: ${number}`);
        res.redirect('/');
        return;
    }

    let formatted_number = "(".concat(number.slice(0, 3), ") ", number.slice(3, 6), "-", number.slice(6))
    log(`Received a call from: ${formatted_number}`);

    // Search database for user based on phone number
    var rows = [];
    try {
        rows = await queryDatabase('SELECT * FROM users WHERE PhoneNumber = ?', [number]);
    } catch (err) {
        log(`Error: ${err}`);
    }

    // If not in database search Virtuous
    if (rows.length == 0) {
        try {
            log(`No entries in database for ${formatted_number}`);
            log(`Searching Virtuous for contact with phone number: ${formatted_number}`);
            rows = await searchForContact(number);
        } catch (err) {
            log(`Error: ${err}`);
        }

        // Add contact to local database
        if (rows.length > 0) {

        }
    }

    // User not in our system
    if (rows.length == 0) {
        log(`No entries found for: ${formatted_number}`);
        res.render('handle_call', {phone_number: formatted_number, found_user: false, user: null, note: null, noteTypes: null});
        return;
    }

    log(`Found user: ${rows[0].FullName}`);

    // Get contact notes
    const note = await getContactNotes(rows[0].ContactID);
    if (note == undefined) {
        log(`No notes found for: ${rows[0].FullName}`);
    } else {
        cleanNote(note);
    }

    // Get note types
    const noteTypes = await queryDatabase('SELECT * FROM noteTypes');

    // Render page with user info
    res.render('handle_call', {phone_number: formatted_number, found_user: true, user: rows[0], note, noteTypes});
});

// Start server on port
server.listen(port, () => {
    log(`Server is running on http://localhost:${port}`);
});