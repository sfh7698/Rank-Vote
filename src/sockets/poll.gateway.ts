import { Namespace } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import { Socket } from 'socket.io';
import PollService from '../api/polls/poll.service';
import { authAdmin } from './socket.middlewares';

export default (io: Namespace, socket: Socket) => {
    const pollService = new PollService();

    const handleDisconnect = async () => {
        const { pollID, userID } = socket.data;
        try {
            const updatedPoll = await pollService.removeParticipant(pollID, userID);

            const roomName = pollID;
            const clientCount = io.adapter.rooms?.get(roomName)?.size ?? 0;

            generalLogger.info(`Disconnected socket id: ${socket.id}`);
            generalLogger.info(`Number of connected sockets: ${io.sockets.size}`);
            generalLogger.info(`Total clients connected to room '${roomName}': ${clientCount}`);

            if(updatedPoll) {
                io.to(pollID).emit('poll_updated', updatedPoll);
            }
        } catch (e) {
            socket.emit("error", e);
        }        
   }

   const removeParticipant = async (id: string) => {
        const { pollID } = socket.data;
        generalLogger.info(`Attempting to remove participant ${id} from poll ${pollID}`);

        try {
            const updatedPoll = await pollService.removeParticipant(pollID, id);

            if (updatedPoll) {
                io.to(pollID).emit('poll_updated', updatedPoll);
            }

        } catch (e) {
            socket.emit("error", e);
        }

   }
    socket.use((packet, next) => {
        const eventName = packet[0];
        try {
            if (eventName === 'remove_participant') {
                authAdmin(socket, next);
            }

        } catch (e) {
            socket.emit("error", e);
        }
    });

    socket.on('remove_participant', removeParticipant);
    socket.on('disconnect', handleDisconnect);

}