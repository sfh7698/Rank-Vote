type ExceptionType = 'BadRequest' | 'Unauthorized' | 'Unknown';

export class Exception extends Error {
    readonly type: ExceptionType;
    readonly statusCode: number;

    constructor(type: ExceptionType, message: string, statusCode: number) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
    }

    getType = () => {
        return this.type;
    }

    getStatus = () => {
        return this.statusCode;
    }
}

export class BadRequestException extends Exception {
    constructor(message: string) {
        super('BadRequest', message, 400);
    }
}

export class UnauthorizedException extends Exception {
    constructor(statusCode: 401 | 403, message: string) {
        super('Unauthorized', message, statusCode);
    }
}

export class UnknownException extends Exception {
    constructor(message: string) {
        super('Unknown', message, 500);
    }
}