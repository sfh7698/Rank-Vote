import PollService from "../../api/polls/poll.service.js";
import { generalLogger, errorLogger } from "../../utils/loggers.js";
import { Socket } from "socket.io";
import { NextFunction } from "../types.js";
import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/errorHandler.js";
import { SocketWithAuth} from "../types.js";
import {ClientToServerEvents, ServerToClientEvents} from "shared";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { isJwtPayload } from "../utils/isJwtPayload.js";
import { UnknownException } from "../../utils/exceptions.js";

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