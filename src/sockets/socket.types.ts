import { RejoinPollFields } from "../api/polls/poll.types";
import { Socket } from 'socket.io';

export interface ServerToClientEvents {
    disconnect: () => void;
    hello: (message: string) => void;
    error: (error: string) => void;
}

export interface SocketWithAuth extends Socket {
    data: RejoinPollFields;
};
