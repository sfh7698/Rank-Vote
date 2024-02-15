import { RejoinPollFields } from "../api/polls/types";

export interface SocketWithAuth extends RejoinPollFields {};

export type NextFunction = (err?: any) => void;
