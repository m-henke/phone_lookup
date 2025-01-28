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

module.exports = { log };