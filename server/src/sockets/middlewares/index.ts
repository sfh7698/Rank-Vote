import { Namespace, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { authAdmin, isAdminEvent } from './admin';
import { nominateSchema } from '../middlewares/validate';
import { sendError } from "../utils/errorHandler";
import { ClientToServerEvents, ServerToClientEvents, SocketWithAuth} from "../socket.types";

export default (_: Namespace<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>, 
    socket: Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketWithAuth>) => {
        
    socket.use((packet, next) => {
        const eventName = packet[0];

        if (!isAdminEvent(eventName)) {
            next();
            return;
        }
        authAdmin(socket, next);
    });

    socket.use((packet, next) => {
        const eventName = packet[0];
        const data = packet[1];
        
        if(eventName === 'nominate') {
            const { error } = nominateSchema.validate(data);

            if (error) {
                sendError(socket, error.details[0].message);
                return;
            }
        }
        next();
    });

}
