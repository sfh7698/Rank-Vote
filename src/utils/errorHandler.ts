import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import { errorLogger } from "./loggers";

export const apiErrorhandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
    if(err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }

    errorLogger.error(err);
    return res.status(500).json(err.message);
    
}
