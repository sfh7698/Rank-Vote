import { createAction } from "@reduxjs/toolkit/react";

export const initializeSocket = createAction('socket/initalize');

type socketPayload = 
    | { eventName: "disconnect", delay: number }
    | { eventName: "remove_participant", data: { id: string } }
    | { eventName: "nominate", data: { text: string } }
    | { eventName: "remove_nomination", data: { id: string } }
    | { eventName: "start_vote"}
    | { eventName: "submit_rankings", data: { rankings: string[] } }
    | { eventName: "close_poll"}
    | { eventName: "cancel_poll"}

export const emitSocketEvent = createAction<socketPayload>('socket/emit');

