import winston from 'winston';

export const filename = 'logs/logFile.log';

const fileTransport = new winston.transports.File({filename: filename});


export const generalLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp( {format: 'YYYY-MM-DD HH:mm:ss'} ),
        winston.format.simple()
    ),
    transports: [fileTransport]
});

export const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.errors(),
    transports: [fileTransport]
});


