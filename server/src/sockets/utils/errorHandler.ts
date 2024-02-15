import { Socket } from "socket.io";
import { Exception } from "../../utils/exceptions";
import { SocketWithAuth} from "../types";
import {ClientToServerEvents, ServerToClientEvents} from "shared";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const sendError = (socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>,
    e: unknown) => {
        
    if (e instanceof(Exception)) {
        socket.emit("error", {type: e.getType(), message: e.message});
    } else {
        socket.emit("error", e as string);
    }

}
