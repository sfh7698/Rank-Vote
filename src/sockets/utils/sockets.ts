import { Server } from "socket.io";

export const getNumSockets = (io: Server, namespace: string) : Number => {
    return io.of(namespace).sockets.size;
}