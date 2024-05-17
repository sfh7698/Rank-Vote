import { generalLogger } from '../utils/loggers.js';
import pollHandlers from './poll.gateway.js';
import middlewares from './middlewares/index.js';
import io from '../index.js';
import { Socket } from 'socket.io';
import PollService from '../api/polls/poll.service.js';
import { sendError } from './utils/errorHandler.js';
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketWithAuth} from "./types.js";
import {ClientToServerEvents, ServerToClientEvents} from "shared";


const onConnection = async(socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>) => {
    const pollService = new PollService();
    const { userID, pollID, name } = socket.data;

    generalLogger.info(`Socket connected with userID: ${userID}, pollID: ${pollID}, and name: ${name}`)

    generalLogger.info(`WS Client  with id: ${socket.id} connected`);
    generalLogger.info(`Number of connected sockets: ${io.sockets.size}`);

    const roomName = pollID;
    await socket.join(roomName);
    
    const connectedClients = io.adapter.rooms?.get(roomName)?.size ?? 0;

    generalLogger.info(`userID: ${userID} joined room with name: ${roomName}`);
    generalLogger.info(`Total clients connected to room '${roomName}': ${connectedClients}`);

    try {
        const updatedPoll = await pollService.addParticipant({
            pollID,
            userID,
            name
        });

        if(updatedPoll) {
            io.to(roomName).emit('poll_updated', updatedPoll);
        }

    } catch (e){
        sendError(socket, e);
    }

    middlewares(io, socket);
    pollHandlers(io, socket);
}

export default onConnection;