import jwt, { JwtPayload } from "jsonwebtoken";
import { generalLogger, errorLogger } from "../../utils/loggers.js";
import { Socket } from "socket.io";
import { NextFunction } from "../types.js";
import { getToken } from "../utils/getToken.js";
import { BadRequestException, UnknownException } from "../../utils/exceptions.js";
import { SocketWithAuth} from "../types.js";
import {ClientToServerEvents, ServerToClientEvents} from "shared";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { isJwtPayload } from "../utils/isJwtPayload.js";

// (createTokenMiddleware)
export const verifyToken = (socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>, 
    next: NextFunction) => {
    const token = getToken(socket);

    if(!token) {
        errorLogger.error('No authorization token provided');
        next(new BadRequestException('No token provided'));
        return;
    }

    
    if (process.env.JWT_SECRET === undefined) {
        errorLogger.error("jwt secret not defined");
        next(new UnknownException("Internal Server Error"));
        return;
    }
    
    generalLogger.info(`Validating auth token before connection: ${token}`);
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if(isJwtPayload(payload)) {
            socket.data.userID = payload.subject;
            socket.data.pollID = payload.pollID;
            socket.data.name = payload.name;
            next();
        } else {
            errorLogger.error("JWT payload not verified in verifyToken");
            throw new UnknownException("Unknown error occurred");
        }

    } catch (e) {
        next(e);
    }

}


