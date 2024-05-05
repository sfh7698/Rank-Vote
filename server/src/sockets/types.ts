import { RejoinPollFields } from "../api/polls/types.js";

export interface SocketWithAuth extends RejoinPollFields {};

export type NextFunction = (err?: any) => void;
