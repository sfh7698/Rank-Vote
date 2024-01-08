import { Namespace, Socket } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import PollService from '../api/polls/poll.service';
import { ClientToServerEvents } from './socket.types';

export default (io: Namespace, socket: Socket) => {
    const pollService = new PollService();

    const handleDisconnect: ClientToServerEvents["disconnect"] = async () => {
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

   // change remove participant to handle receiving an object instead of just a string
   const removeParticipant: ClientToServerEvents['remove_participant'] = async ({id}) => {
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

   const nominate: ClientToServerEvents["nominate"] = async ({text}) => {
        const { userID, pollID } = socket.data;
        generalLogger.info(`Attempting to add nomination for user ${userID} to poll ${pollID}\n${text}`);

        try {
            const updatedPoll = await pollService.addNomination({
                pollID,
                userID,
                text
            });

            io.to(pollID).emit('poll_updated', updatedPoll);

        } catch(e) {
            socket.emit('error', e);
        }

   }

   const removeNomination: ClientToServerEvents["remove_nomination"] = async ({id}) => {
        const { pollID } = socket.data;
        generalLogger.info(`Attempting to remove nomination ${id} from poll ${pollID}`);

        try {
            const updatedPoll = await pollService.removeNomination(pollID, id);

            io.to(pollID).emit("poll_updated", updatedPoll);

        } catch(e) {
            socket.emit("error", e);
        }

   }

   socket.on('remove_participant', removeParticipant);
   socket.on('nominate', nominate);
   socket.on('remove_nomination', removeNomination);
   socket.on('disconnect', handleDisconnect);

}