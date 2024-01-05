import { Poll, RejoinPollFields } from "../api/polls/poll.types";

export interface ServerToClientEvents {
    poll_updated: (poll: Poll) => void;
    disconnect: () => void;
    error: (error: string) => void;
}

export interface SocketWithAuth {
    data: RejoinPollFields;
};
