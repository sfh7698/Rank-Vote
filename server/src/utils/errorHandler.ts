import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import { errorLogger } from "./loggers";
import { Exception } from "shared";

export const apiErrorhandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
    if(err instanceof ValidationError) {
        return res.status(err.statusCode).json({message: err.details});
    }

    errorLogger.error(err);
    if (err instanceof(Exception)) {
        return res.status(err.getStatus()).json({message: err.message});
    }
    return res.sendStatus(500);
}
