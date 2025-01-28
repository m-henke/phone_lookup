const express = require('express');
const { postNewNote } = require('../utils/virtuous');
const { log } = require('../utils/logger');
const router = express.Router();

router.post('/new-note', async (req, res) => {
    try {
        await postNewNote(req.body.contactId, req.body.type, req.body.note, req.body.userName);
        log(`Note added successfully for: ${req.body.contactId}`);
        res.json({ success: true });
    } catch (error) {
        log(`Failed to add note for: ${req.body.contactId}`);
        res.json({ success: false });
    }
});

module.exports = router;