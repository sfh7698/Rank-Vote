import { Poll, RejoinPollFields } from "../api/polls/poll.types";

export interface ServerToClientEvents {
    poll_updated: (poll: Poll) => void;
    error: (error: string) => void;
    connect_error: (error: string) => void;
}

export interface ClientToServerEvents {
    disconnect: () => void;
    remove_participant: (params: { id: string }) => void;
    nominate: (params: {text: string}) => void;
    remove_nomination: (params: {id: string}) => void;
    start_vote: () => void;
    submit_rankings: (params: {rankings: string[]}) => void;
}

export interface SocketWithAuth {
    data: RejoinPollFields;
};

export type NextFunction = (err?: any) => void;
