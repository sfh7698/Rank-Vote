import jwt, { JwtPayload } from "jsonwebtoken";
import { generalLogger } from "../utils/loggers";
import { errorLogger } from "../utils/loggers";
import { SocketWithAuth } from "./socket.types";

export const createTokenMiddleware = (socket: SocketWithAuth, next: (err?: any) => void) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token'];

    generalLogger.info(`Validating auth token before connection: ${token}`);

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
