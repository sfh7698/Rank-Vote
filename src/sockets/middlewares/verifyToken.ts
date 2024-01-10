import jwt, { JwtPayload } from "jsonwebtoken";
import { generalLogger, errorLogger } from "../../utils/loggers";
import { Socket } from "socket.io";
import { NextFunction } from "../socket.types";
import { getToken } from "../utils/getToken";
import { BadRequestException, UnknownException } from "../../utils/exceptions";

// (createTokenMiddleware)
export const verifyToken = (socket: Socket, next: NextFunction) => {
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
    
    // generalLogger.info(`Validating auth token before connection: ${token}`);
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        // Figure out how to type the following
        socket.data.userID = payload.subject;
        socket.data.pollID = payload.pollID;
        socket.data.name = payload.name;
        next();

    } catch (e) {
        next(e);
    }

}


