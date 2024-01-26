import winston from 'winston';

export const filename = 'logs/logFile.log';

const transport = process.env.NODE_ENV === 'development' ? 
    new winston.transports.Console() : 
    new winston.transports.File({filename: filename});


export const generalLogger = winston.createLogger({
    level: process.env.LOGGER_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp( {format: 'YYYY-MM-DD HH:mm:ss'} ),
        winston.format.simple()
    ),
    transports: [transport]
});

export const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.errors(),
    transports: [transport]
});


