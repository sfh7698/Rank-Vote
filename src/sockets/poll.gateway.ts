import { Namespace } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import { Socket } from 'socket.io';
import PollService from '../api/polls/poll.service';
import { authAdmin } from './middlewares/socket.middlewares';

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

   // change remove participant to handle receiving an object instead of just a string
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

   const nominate = async (nomination: {text: string}) => {
        const { userID, pollID } = socket.data;
        generalLogger.info(`Attempting to add nomination for user ${userID} to poll ${pollID}\n${nomination.text}`);

        try {
            const updatedPoll = await pollService.addNomination({
                pollID,
                userID,
                text: nomination.text
            });

            io.to(pollID).emit('poll_updated', updatedPoll);

        } catch(e) {
            socket.emit('error', e);
        }

   }

    socket.use((packet, next) => {
        const eventName = packet[0];
        // create a file in utils that exports a function that checks if the event is an admin event then use as condition
        if (eventName === 'remove_participant') {
            authAdmin(socket, next);
        }
    });
    // add another socket.use() middleware that checks if the event is of type remove_nomination and then validate schema using imported function

    socket.on('nominate', nominate);
    socket.on('remove_participant', removeParticipant);
    socket.on('disconnect', handleDisconnect);

}