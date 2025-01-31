const express = require('express');
const path = require('path');
const cron = require('node-cron');
const { log } = require('./utils/logger');
const indexRouter = require('./routes/index');
const notesRouter = require('./routes/notes');
const callsRouter = require('./routes/calls');
const { updateNoteTypes } = require('./utils/database');
const server = express();
const port = 8080;

// Set cron job to update notetypes daily at midnight
cron.schedule('0 0 * * *', updateNoteTypes);

// Setup view engine and static files
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.json());

// Use routes
server.use('/', indexRouter);
server.use('/', notesRouter);
server.use('/', callsRouter);

// Start server on port
server.listen(port, () => {
    log('info', "", `Server is running on http://localhost:${port}`);
});