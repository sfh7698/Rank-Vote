import { Poll, RejoinPollFields } from "../api/polls/poll.types";

export interface ServerToClientEvents {
    poll_updated: (poll: Poll) => void;
    disconnect: () => void;
    error: (error: string) => void;
    connect_error: (error: string) => void;
}

export interface ClientToServerEvents {
    removeParticipant: (params: { id: string }) => void;
    nominate: (params: {text: string}) => void;
}

export interface SocketWithAuth {
    data: RejoinPollFields;
};

export type NextFunction = (err?: any) => void;
