const express = require('express');
const { queryDatabase, insertDatabase } = require('../utils/database');
const { getContactNotes, searchForIndividual, searchForContact, cleanNote } = require('../utils/virtuous');
const { log } = require('../utils/logger');
const router = express.Router();

router.get('/handle-call', async (req, res) => {
    const { phone_number: number, user_name } = req.query;
    const formatted_number = `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;

    if (number.length !== 10) {
        log(`Received an invalid number: ${formatted_number}`);
        res.status(400).json({ success: false, message: 'Invalid phone number' });
        return;
    }

    log(`${user_name} received a call from: ${formatted_number}`);

    // Search database for user based on phone number
    let rows = [];
    try {
        rows = await queryDatabase('SELECT * FROM users WHERE PhoneNumber = ?', [number]);
    } catch (err) {
        log(`Error: ${err}`);
    }

    // If not in database search Virtuous
    if (rows.length === 0) {
        try {
            log(`No entries in database for ${formatted_number}`);
            log(`Searching Virtuous for contact with phone number: ${formatted_number}`);
            rows = await searchForIndividual(number);
        } catch (err) {
            log(`Error: ${err}`);
        }

        // Add contact to local database
        if (rows.length > 0) {
            let email = "";
            for (let i = 0; i < rows[0].contactMethods.length; i++) {
                if (rows[0].contactMethods[i].isPrimary && rows[0].contactMethods[i].type.includes("Email")) {
                    email = rows[0].contactMethods[i].value;
                    break;
                }
            }
            let giftData;
            try {
                giftData = await searchForContact(rows[0].contactId);
                const data = [
                    `${rows[0].firstName} ${rows[0].lastName}`,
                    rows[0].id, rows[0].contactId,
                    number, email,
                    giftData.date, giftData.amount
                ];
                await insertDatabase(data);
                rows = await queryDatabase('SELECT * FROM users WHERE PhoneNumber = ?', [number]);
            } catch (err) {
                log(`Error: ${err}`);
                log(`Contact not added to local database`);
            }
        }
    }

    // User not in our system
    if (rows.length === 0) {
        log(`No entries found for: ${formatted_number}`);
        res.render('handle_call', { phone_number: formatted_number, found_user: false, user: null, note: null, noteTypes: null, userName: user_name });
        return;
    }

    log(`Found user: ${rows[0].FullName}`);

    // Get contact notes
    let note;
    try {
        note = await getContactNotes(rows[0].ContactID);
        if (note === undefined) {
            log(`No notes found for: ${rows[0].FullName}`);
        } else {
            cleanNote(note);
        }
    } catch (err) {
        log(`Error: ${err}`);
    }

    // Get note types
    const noteTypes = await queryDatabase('SELECT * FROM noteTypes');

    // Render page with user info
    res.render('handle_call', { phone_number: formatted_number, found_user: true, user: rows[0], note, noteTypes, userName: user_name });
});

module.exports = router;