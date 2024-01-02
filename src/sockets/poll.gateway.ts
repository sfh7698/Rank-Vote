import { Socket, Server } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import { getNumSockets } from '../utils/sockets';

export default (io: Server, socket: Socket) => {

    const handleDisconnect = () => {
        generalLogger.info(`Disconnected socket id: ${socket.id}`);
        generalLogger.info(`Number of connected sockets: ${getNumSockets(io, '/polls')}`);

        // TODO - remove client from poll and send `participants_updated` event to remaining clients
    }

    socket.on('disconnect', handleDisconnect);

}