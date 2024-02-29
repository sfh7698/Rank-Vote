import { createListenerMiddleware, addListener} from "@reduxjs/toolkit/react";
import { AppDispatch, RootState } from "../store";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "shared";
import { setPoll } from "../slices/pollSlice";
import { setError } from "../slices/errorSlice";
import { initializeSocket, emitSocketEvent } from "../socketActions"


const socketMiddleware = createListenerMiddleware();

socketMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    predicate: (action, curState) => {
        // const isValidAction = initializeSocket.match(action) || emitSocketEvent.match(action);
        const isValidState = curState.auth.accessToken !== null;
        return initializeSocket.match(action) && isValidState;
        // return isValidAction && isValidState;
    },
    effect: async (_, {getState, dispatch}) => {

        const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:8080/polls", {
            auth: {
                token: getState().auth.accessToken
            }
        });

        socket.on("connect", () => {
            console.log(`socket with id ${socket.id} connected`);
        })

        socket.on("poll_updated", (poll) =>{
            dispatch(setPoll(poll))
        });

        socket.on('error', (error): void => {
            dispatch(setError(error.message))
        })

        socket.on('connect_error', (_): void => {
            dispatch(setError("Failed to connect to poll"));
        });

        socket.on("poll_cancelled", () => {
            dispatch(setError("Poll Cancelled"));
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
                        socket.disconnect();
                        break;
                    default:
                        console.log(eventName);
                        console.log(socket.id);
                        socket.emit(eventName);
                }
            }
        }))
    }
});

export default socketMiddleware;
