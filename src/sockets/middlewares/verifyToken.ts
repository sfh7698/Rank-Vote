import jwt, { JwtPayload } from "jsonwebtoken";
import { generalLogger, errorLogger } from "../../utils/loggers";
import { Socket } from "socket.io";
import { NextFunction } from "../socket.types";
import { getToken } from "../utils/getToken";

// (createTokenMiddleware)
export const verifyToken = (socket: Socket, next: NextFunction) => {
    const token = getToken(socket);

    if(!token) {
        errorLogger.error('No authorization token provided');
        socket.emit('error', 'No token provided');
        return;
    }

    
    if (process.env.JWT_SECRET === undefined) {
        errorLogger.error("jwt secret not defined");
        socket.emit("error", "Internal Server Error");
        return;
    }
    
    // generalLogger.info(`Validating auth token before connection: ${token}`);
    
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


