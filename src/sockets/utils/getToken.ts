import { Socket } from "socket.io";

export const getToken = (socket: Socket): string => {
    return socket.handshake.auth.token || socket.handshake.headers['token'];
}