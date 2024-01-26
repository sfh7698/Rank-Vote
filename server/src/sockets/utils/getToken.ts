import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents, SocketWithAuth} from "../socket.types";

export const getToken = (socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>): string => {
    return socket.handshake.auth.token || socket.handshake.headers['token'];
}