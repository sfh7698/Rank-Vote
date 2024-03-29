import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import { errorLogger } from "./loggers";
import { Exception } from "./exceptions";

export const apiErrorhandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
    if(err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }

    errorLogger.error(err);
    if (err instanceof(Exception)) {
        return res.status(err.getStatus()).json(err.message);
    }
    return res.sendStatus(500);
}
