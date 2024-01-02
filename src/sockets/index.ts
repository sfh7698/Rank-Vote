import { Socket } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import { getNumSockets } from '../utils/sockets';
import pollHandlers from './poll.gateway';
import io from '../index';

const onConnection = (socket: Socket) => {
    generalLogger.info(`Socket connected with userID: ${socket.data.userID}, pollID: ${socket.data.pollID} 
        and name: ${socket.data.name}`)

    generalLogger.info(`WS Client  with id: ${socket.id} connected`);
    generalLogger.info(`Number of connected sockets: ${getNumSockets(io, '/polls')}`);

    io.of("/polls").emit('hello', `from ${socket.id}`);
    pollHandlers(io, socket);
}

export default onConnection;