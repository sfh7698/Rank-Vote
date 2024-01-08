import { Namespace, Socket } from "socket.io";
import { authAdmin, isAdminEvent } from './admin';
import { nominateSchema } from '../middlewares/validate';

export default (_: Namespace, socket: Socket) => {
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
                socket.emit("error", error.details[0].message);
                return;
            }
        }
        next();
    });

}
