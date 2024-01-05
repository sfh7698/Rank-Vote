import { generalLogger } from '../utils/loggers';
import pollHandlers from './poll.gateway';
import io from '../index';
import { Socket } from 'socket.io';
import PollService from '../api/polls/poll.service';

const onConnection = async(socket: Socket) => {
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

        io.to(roomName).emit('poll_updated', updatedPoll);
    } catch (e){
        socket.emit("error", e);
    }

    pollHandlers(io, socket);
}

export default onConnection;