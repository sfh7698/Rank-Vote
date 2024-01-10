import { Namespace, Socket } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import PollService from '../api/polls/poll.service';
import { ClientToServerEvents, ServerToClientEvents, SocketWithAuth } from './socket.types';
import { sendError } from './utils/errorHandler';
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default (io: Namespace<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>,
    socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>) => {
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
            sendError(socket, e);
        }        
   }

   const removeParticipant: ClientToServerEvents['remove_participant'] = async ({id}) => {
        const { pollID } = socket.data;
        generalLogger.debug(`Attempting to remove participant ${id} from poll ${pollID}`);

        try {
            const updatedPoll = await pollService.removeParticipant(pollID, id);

            if (updatedPoll) {
                io.to(pollID).emit('poll_updated', updatedPoll);
            }

        } catch (e) {
            sendError(socket, e);
        }

   }

   const nominate: ClientToServerEvents["nominate"] = async ({text}) => {
        const { userID, pollID } = socket.data;
        generalLogger.debug(`Attempting to add nomination for user ${userID} to poll ${pollID}\n${text}`);

        try {
            const updatedPoll = await pollService.addNomination({
                pollID,
                userID,
                text
            });

            io.to(pollID).emit('poll_updated', updatedPoll);

        } catch(e) {
            sendError(socket, e);
        }

   }

   const removeNomination: ClientToServerEvents["remove_nomination"] = async ({id}) => {
        const { pollID } = socket.data;
        generalLogger.debug(`Attempting to remove nomination ${id} from poll ${pollID}`);

        try {
            const updatedPoll = await pollService.removeNomination(pollID, id);

            io.to(pollID).emit("poll_updated", updatedPoll);

        } catch(e) {
            sendError(socket, e);
        }

   }

   const startVote: ClientToServerEvents['start_vote'] = async () => {
        const { pollID } = socket.data;
        generalLogger.debug(`Attempting to start voting for poll: ${pollID}`);

        try {
            const updatedPoll = await pollService.startPoll(pollID);
            io.to(pollID).emit("poll_updated", updatedPoll);

        } catch(e) {
            sendError(socket, e);
        }
   }

   const submitRankings: ClientToServerEvents["submit_rankings"] = async ({rankings}) => {
        const { userID, pollID } = socket.data;
        generalLogger.debug(`Submitting votes for user: ${userID} belonging to pollID: "${pollID}"`);

        try {
            const updatedPoll = await pollService.submitRankings({
                pollID,
                userID,
                rankings
            });

            io.to(pollID).emit("poll_updated", updatedPoll);

        } catch (e) {
            sendError(socket, e);
        }


   }

   socket.on('submit_rankings', submitRankings);
   socket.on('start_vote', startVote);
   socket.on('remove_participant', removeParticipant);
   socket.on('nominate', nominate);
   socket.on('remove_nomination', removeNomination);
   socket.on('disconnect', handleDisconnect);

}