import jwt, { JwtPayload } from "jsonwebtoken";
import { generalLogger } from "../utils/loggers";
import { errorLogger } from "../utils/loggers";
import { Socket } from "socket.io";
import { NextFunction } from "./socket.types";
import { getToken } from "./utils/getToken";
import PollService from "../api/polls/poll.service";

export const createTokenMiddleware = (socket: Socket, next: NextFunction) => {
    const token = getToken(socket);

    // generalLogger.info(`Validating auth token before connection: ${token}`);

    if (process.env.JWT_SECRET === undefined) {
        errorLogger.error("jwt secret not defined");
        socket.emit("error", "Internal Server Error");
        return  
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        socket.data.userID = payload.subject;
        socket.data.pollID = payload.pollID;
        socket.data.name = payload.name;
        next();

    } catch (e) {
        next(e);
    }

}

export const authAdmin = async (socket: Socket, next: NextFunction) => {
    const pollService = new PollService();
    const token = getToken(socket);

    if(!token) {
        errorLogger.error('No authorization token provided');
        socket.emit('error', 'No token provided');
        return;
    }

    if (process.env.JWT_SECRET === undefined) {
        errorLogger.error("jwt secret not defined");
        socket.emit("error", "Internal Server Error");
        return  
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        // use env variables to set the level for logs
        // generalLogger.debug(`Validating admin using token payload`, payload);

        const { subject, pollID } = payload;

        const poll = await pollService.getPoll(pollID);

        if (subject !== poll.adminID) {
            socket.emit('error', 'Admin privileges required');
            return;
        }
        next();

    } catch (e) {
        socket.emit('error', e);
    }
}
