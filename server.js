const express = require('express');
const server = express();
const path = require('path');
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

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => {
    res.render('index');
});

server.get('/handle-call', (req, res) => {
    let number = req.query.phone_number;

    // Make sure number is valid
    let formatted_number = number.toString().replace(/\D/g, '');
    if (formatted_number.length != 10) {
        log(`Received an invalid number: ${formatted_number}`);
        res.redirect('/');
        return;
    }

    // Format number
    formatted_number = "(".concat(formatted_number.slice(0, 3), ") ", formatted_number.slice(3, 6), "-", formatted_number.slice(6))
    log(`Received a call from: ${formatted_number}`);

    res.render('handle_call', {phone_number: formatted_number});
});

server.listen(port, () => {
    log(`Server is running on http://localhost:${port}`);
});
