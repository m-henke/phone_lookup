const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

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

// Used to call the logger from the rest of the program
function log(level, location, data) {
    if (level == 'callLog') {
        callLogger.log({
            level: "info",
            location: location,
            data: data
        });
    } else {
        logger.log({
            level: level,
            location: location,
            data: data
        });
    }
}

module.exports = { log };