const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const datetime = require('date-fns');
const axios = require('axios');

// Formatting for logging to the terminal
const infoConsoleFormat = combine(
    format.colorize(),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    printf(({ location, level, data, timestamp }) => {
        return `${timestamp} [${level}] [${location}] ${data}`;
    })
);

// Formatting for logging to a file
const fileFormat = combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    format((info) => {
        if (info.data instanceof Error) {
            info.data = info.data.message;
        }
        return info;
    })(),
    format.json()
)

// Initialize the winston logger
const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: infoConsoleFormat
        }),
        new transports.File({ 
            filename: "logs/errors.log", 
            level: 'error',
            format: fileFormat
        })
    ]
});

const callLogger = createLogger({
    transports: [
        new transports.File({
            filename: "logs/calls.log",
            format: fileFormat
        })
    ]
})

function notifyTeams(ErrorMessage, Location) {
    const url = process.env.TEAMS_WEBHOOK;
    const currentDate = new Date();
    if (ErrorMessage instanceof Error) {
        ErrorMessage = ErrorMessage.message;
    }
    let data = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "summary": "Error Occurred",
        "themeColor": "ff0000",
        "title": "Phone Lookup Tool Error",
        "sections": [
            {
            "facts": [
                {
                "name": "Date:",
                "value": `${datetime.format(currentDate, 'yyyy-MM-dd')}`
                },
                {
                "name": "Time:",
                "value": `${datetime.format(currentDate, 'HH:mm:ss')}`
                },
                {
                "name": "Location",
                "value": `${Location}`
                },
                {
                "name": "Error:",
                "value": `${ErrorMessage}`
                }
            ]
            }
        ]
    }

    axios.post(url, data, {
        headers: {'Content-Type': 'application/json'}
    }).catch(error => {
        console.log(error);
    });
}

// Used to call the logger from the rest of the program
function log(level, location, data) {
    if (level == 'callLog') {
        callLogger.log({
            level: "info",
            location: location,
            data: data
        });
    } else {
        // send teams notification
        if (level == 'error') {
            notifyTeams(data, location);
        }
        logger.log({
            level: level,
            location: location,
            data: data
        });
    }
}

module.exports = { log };