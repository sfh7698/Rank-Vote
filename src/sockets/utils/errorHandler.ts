import { Socket } from "socket.io";
import { Exception } from "../../utils/exceptions";

export const sendError = (socket: Socket, e: unknown) => {
    if (e instanceof(Exception)) {
        socket.emit("error", {type: e.getType(), message: e.message});
    } else {
        socket.emit("error", e);
    }

}
