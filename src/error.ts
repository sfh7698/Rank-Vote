import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";

export const globalErrorhandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
    if(err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }

    return res.status(500).json(err.stack);
    
}