import { AddParticipantFields } from "../api/polls/types.js";

export interface SocketWithAuth extends AddParticipantFields {};

export type NextFunction = (err?: any) => void;
