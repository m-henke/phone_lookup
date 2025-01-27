const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('src/data/VirtuousData.db');
const axios = require('axios');

// Prints a message to the console with a timestamp
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
    console.log(`[${formattedDateTime}] ${message}`);
}

// Queries the database based on the given query and parameters
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

// Gets the most recent note for a contact
function getContactNotes(contactID) {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.virtuoussoftware.com/api/ContactNote/ByContact/${contactID}?sortBy=CreatedDateTime&descending=False&skip=0&take=1`, {
            headers: { 'Authorization': `Bearer ${process.env.VIRTUOUS_TOKN}` }
        })
        .then(response => {
            resolve(response.data.list[0]);
        })
        .catch(error => {
            reject(error.data);
        });
    });
}

// Adds a new note to Virtuous profile
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
            reject(error.data);
        });
    });
}

// Searches Virtuous for a contact based on phone number
function searchForContact(number) {
    return new Promise((resolve, reject) => {
        data = { 
            "groups": [ 
                { 
                    "conditions": [ 
                        { 
                            "parameter": "Phone Number", 
                            "operator": "contains", 
                            "value": number 
                        } 
                    ] 
                } 
            ] 
        }
        const url = "https://api.virtuoussoftware.com/api/ContactIndividual/Query?skip=0&take=1";
        axios.post(url, data, {
            headers: {'Authorization': `Bearer ${process.env.VIRTUOUS_TOKN}`, 'Content-Type': 'application/json'}
        }).then(response => {
            resolve(response.data.list);
        }).catch(error => {
            reject(error.data);
        });
    });
}

// Removes html tags from note
function cleanNote(note) {
    note.note = note.note.replace(/<\/?[^>]+(>|$)/g, "");
    note.note = note.note.replace(/&nbsp;/g, " ");
}

module.exports = {
    log,
    queryDatabase,
    getContactNotes,
    postNewNote,
    searchForContact,
    cleanNote
};