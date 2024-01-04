import { Socket, Server } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import { getNumSockets } from './utils/sockets';

export default (io: Server, socket: Socket) => {

    // use a try/catch block inside of event handlers to catch the errors and emit error events
    const handleDisconnect = () => {
        generalLogger.info(`Socket disconnected with userID: ${socket.data.userID}, pollID: ${socket.data.pollID} 
        and name: ${socket.data.name}`);

        generalLogger.info(`Disconnected socket id: ${socket.id}`);
        generalLogger.info(`Number of connected sockets: ${getNumSockets(io, '/polls')}`);

        // TODO - remove client from poll and send `participants_updated` event to remaining clients
    }

    socket.on('disconnect', handleDisconnect);

}