import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorLogger, generalLogger } from '../../../utils/loggers';
import { RequestWithAuth } from '../types';
import { BadRequestException, UnauthorizedException } from 'shared';

export const authRejoin = (req: RequestWithAuth, res: Response, next: NextFunction) => {
    generalLogger.info(`Checking for auth token on request body ${req.body}`);

    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (accessToken === undefined) {
        throw new BadRequestException("Access Token not found");
    }

    if (process.env.JWT_SECRET === undefined) {
        errorLogger.error("jwt secret not defined");
        return res.sendStatus(500);
    }

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET) as JwtPayload;

        req.body.userID = payload.subject;
        req.body.pollID = payload.pollID;
        req.body.name = payload.name;
        next();

    } catch (e){
        if (e instanceof(Error)) {
            throw new UnauthorizedException(401, e.message);
        }
        return res.sendStatus(401);
    }
}
