import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { generalLogger } from './utils/loggers';
import { ServerToClientEvents, SocketWithAuth } from './sockets/socket.types';
import { createTokenMiddleware } from './sockets/socket.middlewares';
import onConnection from './sockets';
import app from './app';

const server = createServer(app);

const io = new Server<ServerToClientEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>(server);

// TODO - add a validation middleware
io.of('polls').use(createTokenMiddleware).on('connection', onConnection);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    generalLogger.info(`Server is running at http://localhost:${port}`);
});

export default io;


