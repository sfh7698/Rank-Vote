import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import { generalLogger } from '../../../utils/loggers';
import { RequestWithAuth } from '../poll.types';

export const authRejoin = (req: RequestWithAuth, res: Response, next: NextFunction) => {
    generalLogger.info(`Checking for auth token on request body ${req.body}`);

    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (accessToken === undefined) {
        return res.sendStatus(401);
    }

    if (process.env.JWT_SECRET === undefined) {
        throw new Error("jwt secret not defined");
    }

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET) as JwtPayload;

        if (typeof payload.subject !== 'string' || typeof payload.pollID !== 'string' || typeof payload.name !== 'string'){
            return res.sendStatus(401);
        }
        req.body.userID = payload.subject;
        req.body.pollID = payload.pollID;
        req.body.name = payload.name;
        next();

    } catch (e){
        return res.sendStatus(401);
    }

            

}
