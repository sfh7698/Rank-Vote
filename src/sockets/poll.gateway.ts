import { Namespace, Socket } from 'socket.io';
import { generalLogger } from '../utils/loggers';
import PollService from '../api/polls/poll.service';
import { ClientToServerEvents, ServerToClientEvents, SocketWithAuth } from './socket.types';
import { sendError } from './utils/errorHandler';
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class PollHandlers implements ClientToServerEvents {
    private readonly pollService;
    private socket;
    private io;

    constructor(
        io: Namespace<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>,
        socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>
        ) {
        this.pollService = new PollService();
        this.socket = socket;
        this.io = io;

    }

    disconnect = async () => {
        const { pollID, userID } = this.socket.data;
        try {
            const updatedPoll = await this.pollService.removeParticipant(pollID, userID);

            const roomName = pollID;
            const clientCount = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

            generalLogger.info(`Disconnected socket id: ${this.socket.id}`);
            generalLogger.info(`Number of connected sockets: ${this.io.sockets.size}`);
            generalLogger.info(`Total clients connected to room '${roomName}': ${clientCount}`);

            if(updatedPoll) {
                this.io.to(pollID).emit('poll_updated', updatedPoll);
            }
        } catch (e) {
            sendError(this.socket, e);
        }        
   }

   remove_participant = async (params: { id: string }) => {
        const { pollID } = this.socket.data;
        const { id } = params;
        generalLogger.debug(`Attempting to remove participant ${id} from poll ${pollID}`);

        try {
            const updatedPoll = await this.pollService.removeParticipant(pollID, id);

            if (updatedPoll) {
                this.io.to(pollID).emit('poll_updated', updatedPoll);
            }

        } catch (e) {
            sendError(this.socket, e);
        }

   }

   nominate = async (params: {text: string}) => {
        const { userID, pollID } = this.socket.data;
        const { text } = params;

        generalLogger.debug(`Attempting to add nomination for user ${userID} to poll ${pollID}\n${text}`);

        try {
            const updatedPoll = await this.pollService.addNomination({
                pollID,
                userID,
                text
            });

            this.io.to(pollID).emit('poll_updated', updatedPoll);

        } catch(e) {
            sendError(this.socket, e);
        }

   }

   remove_nomination = async (params: {id: string}) => {
        const { pollID } = this.socket.data;
        const { id } = params;

        generalLogger.debug(`Attempting to remove nomination ${id} from poll ${pollID}`);

        try {
            const updatedPoll = await this.pollService.removeNomination(pollID, id);

            this.io.to(pollID).emit("poll_updated", updatedPoll);

        } catch(e) {
            sendError(this.socket, e);
        }

   }

   start_vote = async () => {
        const { pollID } = this.socket.data;
        generalLogger.debug(`Attempting to start voting for poll: ${pollID}`);

        try {
            const updatedPoll = await this.pollService.startPoll(pollID);
            this.io.to(pollID).emit("poll_updated", updatedPoll);

        } catch(e) {
            sendError(this.socket, e);
        }
   }

   submit_rankings = async (params: {rankings: string[]}) => {
        const { userID, pollID } = this.socket.data;
        const { rankings } = params;

        generalLogger.debug(`Submitting votes for user: ${userID} belonging to pollID: "${pollID}"`);

        try {
            const updatedPoll = await this.pollService.submitRankings({
                pollID,
                userID,
                rankings
            });

            this.io.to(pollID).emit("poll_updated", updatedPoll);

        } catch (e) {
            sendError(this.socket, e);
        }
   }


}
export default (io: Namespace<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>,
    socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>) => {

        const pollHandlers = new PollHandlers(io, socket);

        socket.on('submit_rankings', pollHandlers.submit_rankings);
        socket.on('start_vote', pollHandlers.start_vote);
        socket.on('remove_participant', pollHandlers.remove_participant);
        socket.on('nominate', pollHandlers.nominate);
        socket.on('remove_nomination', pollHandlers.remove_nomination);
        socket.on('disconnect', pollHandlers.disconnect);
}