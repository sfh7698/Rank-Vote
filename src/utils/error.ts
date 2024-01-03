import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import { errorLogger } from "./loggers";

export class AppError extends Error {

    readonly status: number;

    constructor(status: number, message?: string){
        super(message);
        this.status = status;
    }
};

export const globalErrorhandler = (err: AppError, _: Request, res: Response, __: NextFunction) => {
    if(err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }

    errorLogger.error(err);
    return res.status(err.status).json(err.message);
    
}