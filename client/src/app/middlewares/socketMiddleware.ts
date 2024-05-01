import { createListenerMiddleware, addListener} from "@reduxjs/toolkit/react";
import { AppDispatch, RootState } from "../store";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "shared";
import { setPoll } from "../slices/pollSlice";
import { errorResponses, setError } from "../slices/errorSlice";
import { initializeSocket, emitSocketEvent } from "../socketActions"
import { getPayloadFromToken } from "../../utils";


const socketMiddleware = createListenerMiddleware();

socketMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    predicate: (action, curState) => {
        return initializeSocket.match(action) && curState.auth.accessToken !== null;
    },
    effect: async (_, {getState, dispatch}) => {

        const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080/polls";

        const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
            auth: {
                token: getState().auth.accessToken
            }
        });

        socket.on("connect", () => {
            console.log(`socket with id ${socket.id} connected`);
        })

        socket.on("poll_updated", (poll) => {
            const token = getState().auth.accessToken;
            const userID = token && getPayloadFromToken(token).subject;
            
            if (userID && !Object.keys(poll.participants).includes(userID)) {
                dispatch(setError(errorResponses.REMOVED_ERROR));
                return
            }
            dispatch(setPoll(poll))
        });

        socket.on('error', (error): void => {
            dispatch(setError(error.message))
        })

        socket.on('connect_error', (_): void => {
            dispatch(setError(errorResponses.TOKEN_ERROR));
        });

        socket.on("poll_cancelled", () => {
            dispatch(setError(errorResponses.CANCELLED_ERROR));
        })

        const emitEventListener = addListener.withTypes<RootState, AppDispatch>();

        dispatch(emitEventListener({
            actionCreator: emitSocketEvent,
            effect: (action, __) => {
                const { eventName } = action.payload;

                switch(eventName) {
                    case("remove_participant"):
                        socket.emit(eventName, action.payload.data);
                        break;
                    case("nominate"):
                        socket.emit(eventName, action.payload.data);
                        break;
                    case("remove_nomination"):
                        socket.emit(eventName, action.payload.data);
                        break;
                    case("submit_rankings"):
                        socket.emit(eventName, action.payload.data);
                        break;
                    case("disconnect"):
                        localStorage.removeItem("accessToken");
                        socket.disconnect();
                        setTimeout(() => {
                            location.reload();
                        }, action.payload.delay);
                        break;
                    default:
                        socket.emit(eventName);
                }
            }
        }))
    }
});

export default socketMiddleware;
