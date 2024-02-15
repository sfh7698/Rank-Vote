import { Poll } from "./poll.types";

export interface ServerToClientEvents {
    poll_updated: (poll: Poll) => void;
    error: (params: {type: string, message: string} | string) => void;
    poll_cancelled: () => void;
}

export interface ClientToServerEvents {
    disconnect: () => void;
    remove_participant: (params: { id: string }) => void;
    nominate: (params: {text: string}) => void;
    remove_nomination: (params: {id: string}) => void;
    start_vote: () => void;
    submit_rankings: (params: {rankings: string[]}) => void;
    close_poll: () => void;
    cancel_poll: () => void;
}