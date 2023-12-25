import winston from 'winston';

export const filename = './logFile.log ';

const fileTransport = new winston.transports.File({filename: filename});


export const generalLogger = winston.createLogger({
    level: 'info',
    format: winston.format.timestamp(),
    transports: [fileTransport]
});

export const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.errors(),
    transports: [fileTransport]
});


