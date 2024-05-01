import PollService from "../../api/polls/poll.service";
import { generalLogger, errorLogger } from "../../utils/loggers";
import { Socket } from "socket.io";
import { NextFunction } from "../types";
import { getToken } from "../utils/getToken";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/errorHandler";
import { SocketWithAuth} from "../types";
import {ClientToServerEvents, ServerToClientEvents} from "shared";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { isJwtPayload } from "../utils/isJwtPayload";
import { UnknownException } from "../../utils/exceptions";

export const isAdminEvent = (eventName: string) => {
    const adminEvents = ["remove_participant", "remove_nomination", "start_vote", "close_poll", "cancel_poll"];
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
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        generalLogger.debug(`Validating admin using token payload`, payload);

        if(isJwtPayload(payload)) {
            const { subject, pollID } = payload;
    
            const poll = await pollService.getPoll(pollID);
    
            if (subject !== poll.adminID) {
                sendError(socket, 'Admin privileges required');
                return;
            }
            next();
        } else {
            errorLogger.error("JWT payload not verified in authAdmin");
            throw new UnknownException("Unknown error occured");
        }

    } catch (e) {
        sendError(socket, e);
    }

}