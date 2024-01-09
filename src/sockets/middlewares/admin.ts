import PollService from "../../api/polls/poll.service";
import { generalLogger, errorLogger } from "../../utils/loggers";
import { Socket } from "socket.io";
import { NextFunction } from "../socket.types";
import { getToken } from "../utils/getToken";
import jwt, { JwtPayload } from "jsonwebtoken";


export const isAdminEvent = (eventName: string) => {
    const adminEvents = ["remove_participant", "remove_nomination", "start_vote"];
    return adminEvents.includes(eventName);
}

export const authAdmin = async (socket: Socket, next: NextFunction) => {
    const pollService = new PollService();
    const token = getToken(socket);

    if (process.env.JWT_SECRET === undefined) {
        errorLogger.error("jwt secret not defined");
        socket.emit("error", "Internal Server Error");
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
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