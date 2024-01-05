import { Namespace } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import { Socket } from 'socket.io';
import PollService from '../api/polls/poll.service';

export default (io: Namespace, socket: Socket) => {
    const pollService = new PollService();

    const handleDisconnect = async() => {
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

    socket.on('disconnect', handleDisconnect);

}