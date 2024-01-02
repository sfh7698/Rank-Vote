import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { generalLogger } from './utils/loggers';
import { ServerToClientEvents } from './api/polls/poll.types';
import onConnection from './sockets';

const server = createServer(app);

const io = new Server<ServerToClientEvents>(server);

io.of('/polls').on('connection', onConnection);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    generalLogger.info(`Server is running at http://localhost:${port}`);
});

export default io;


