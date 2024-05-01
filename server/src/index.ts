import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { generalLogger } from './utils/loggers';
import { SocketWithAuth } from './sockets/types';
import {ClientToServerEvents, ServerToClientEvents} from "shared";
import { verifyToken } from './sockets/middlewares/verifyToken';
import onConnection from './sockets';
import app, {corsOptions} from './app';

const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>(server, {cors: corsOptions});
const pollsNameSpace = io.of('polls');

pollsNameSpace.use(verifyToken).on('connection', onConnection);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    const server = process.env.SERVER_DOMAIN || `http://localhost:${port}`
    generalLogger.info(`Server is running at ${server}`);
});

export default pollsNameSpace;


