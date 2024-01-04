import { RejoinPollFields } from "../api/polls/poll.types";

export interface ServerToClientEvents {
    disconnect: () => void;
    hello: (message: string) => void;
    error: (error: string) => void;
}

export interface SocketWithAuth {
    data: RejoinPollFields;
};
