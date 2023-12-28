import { Joi } from 'express-validation';
import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import { generalLogger } from '../../utils/loggers';
import { RequestWithAuth } from './poll.types';

export const validateCreatePoll = {
    body: Joi.object({
        topic: Joi.string().min(1).max(100).required(),
        votesPerVoter: Joi.number().integer().min(1).max(5).required(),
        name: Joi.string().min(1).max(25).required()
    })
}

export const validateJoinPoll = {
    body: Joi.object({
        pollID: Joi.string().min(6).max(6).required(),
        name: Joi.string().min(1).max(25).required()
    })
}

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

        // append user and poll to socket
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
