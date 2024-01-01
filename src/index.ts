import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import app from './app';
import pollHandlers from './api/polls/poll.gateway';
import { generalLogger } from './utils/loggers';
import { getNumSockets } from './utils/sockets';

const server = createServer(app);

const io = new Server(server);

const onConnection = (socket: Socket) => {
    generalLogger.info(`WS Client  with id: ${socket.id} connected`);
    generalLogger.info(`Number of connected sockets: ${getNumSockets(io, '/polls')}`);

    io.of("/polls").emit('hello', `from ${socket.id}`);
    pollHandlers(io, socket);
}

io.of('/polls').on('connection', onConnection);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    generalLogger.info(`Server is running at http://localhost:${port}`);
});


