import PollService from "../../api/polls/poll.service";
import { generalLogger, errorLogger } from "../../utils/loggers";
import { Socket } from "socket.io";
import { NextFunction } from "../socket.types";
import { getToken } from "../utils/getToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendError } from "../utils/errorHandler";
import { ClientToServerEvents, ServerToClientEvents, SocketWithAuth} from "../socket.types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const isAdminEvent = (eventName: string) => {
    const adminEvents = ["remove_participant", "remove_nomination", "start_vote"];
    return adminEvents.includes(eventName);
}

export const authAdmin = async (socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>, 
    next: NextFunction) => {
    const pollService = new PollService();
    const token = getToken(socket);

    if (process.env.JWT_SECRET === undefined) {
        errorLogger.error("jwt secret not defined");
        sendError(socket, "Internal Server Error");
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        // generalLogger.debug(`Validating admin using token payload`, payload);

        const { subject, pollID } = payload;

        const poll = await pollService.getPoll(pollID);

        if (subject !== poll.adminID) {
            sendError(socket, 'Admin privileges required');
            return;
        }
        next();

    } catch (e) {
        sendError(socket, e);
    }

}