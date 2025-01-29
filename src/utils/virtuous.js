const axios = require('axios');

async function getContactNotes(contactID) {
    const url = `https://api.virtuoussoftware.com/api/ContactNote/ByContact/${contactID}?sortBy=CreatedDateTime&descending=False&skip=0&take=1`;
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${process.env.VIRTUOUS_TOKN}` }
        });
        return response.data.list[0];
    } catch (error) {
        if (error.response.data instanceof Object) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.response.data);
        }
    }
}

async function postNewNote(contactID, noteType, noteContent, userName) {
    const url = "https://api.virtuoussoftware.com/api/ContactNote";
    const noteCreator = `Note Created By: ${userName}\n\n`;
    const data = {
        contactId: contactID,
        type: noteType,
        note: noteCreator + noteContent,
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${process.env.VIRTUOUS_TOKN}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response.data instanceof Object) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.response.data);
        }
    }
}

async function searchForIndividual(number) {
    const data = {
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
    };
    const url = "https://api.virtuoussoftware.com/api/ContactIndividual/Query?skip=0&take=1";

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${process.env.VIRTUOUS_TOKN}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.list;
    } catch (error) {
        if (error.response.data instanceof Object) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.response.data);
        }
    }
}

async function searchForContact(contactId) {
    const url = `https://api.virtuoussoftware.com/api/Contact/${contactId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.VIRTUOUS_TOKN}`,
                'Content-Type': 'application/json'
            }
        });
        return {
            date: response.data.lastGiftDate || "",
            amount: response.data.lastGiftAmount || ""
        };
    } catch (error) {
        if (error.response.data instanceof Object) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.response.data);
        }
    }
}

function cleanNote(note) {
    note.note = note.note.replace(/<\/?[^>]+(>|$)/g, "");
    note.note = note.note.replace(/&nbsp;/g, " ");
}

module.exports = {
    getContactNotes,
    postNewNote,
    searchForIndividual,
    searchForContact,
    cleanNote
};