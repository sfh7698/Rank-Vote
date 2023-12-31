import { Socket, Server } from 'socket.io';
import server from '../../index';
import { generalLogger } from '../../utils/loggers';

const io = new Server(server);

generalLogger.info('Websocket gateway initialized');

io.of('/polls').on('connection', (socket: Socket) => {

});