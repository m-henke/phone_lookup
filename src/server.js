const express = require('express');
const path = require('path');
const { log } = require('./utils/logger');
const indexRouter = require('./routes/index');
const notesRouter = require('./routes/notes');
const callsRouter = require('./routes/calls');
const server = express();
const port = 8080;

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
    log(`Server is running on http://localhost:${port}`);
});