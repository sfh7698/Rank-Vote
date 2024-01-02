import jwt, { JwtPayload } from "jsonwebtoken";
import { generalLogger } from "../utils/loggers";
import { Socket } from "socket.io";

export const createTokenMiddleware = (socket: Socket, next: (err?: any) => void) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token'];

    generalLogger.info(`Validating auth token before connection: ${token}`);

    if (process.env.JWT_SECRET === undefined) {
        throw new Error("jwt secret not defined");
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