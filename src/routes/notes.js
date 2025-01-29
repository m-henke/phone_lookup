const express = require('express');
const { postNewNote } = require('../utils/virtuous');
const { log } = require('../utils/logger');
const router = express.Router();

router.post('/new-note', async (req, res) => {
    try {
        await postNewNote(req.body.contactId, req.body.type, req.body.note, req.body.userName);
        log('info', "", `Note added successfully for: ${req.body.contactId}`);
        res.json({ success: true });
    } catch (error) {
        log('info', "", `Failed to add note for: ${req.body.contactId}`);
        log('error', "adding note", error)
        res.json({ success: false });
    }
});

module.exports = router;