import { apiSlice } from "./apiSlice";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "shared";
import { RootState } from "../store";
import {Poll} from "shared";
import { setPoll } from "./pollSlice";
import { setError } from "./errorSlice";


export const socketSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        streamPollUpdates: builder.query<Poll | null, void>({
            queryFn: (_, {getState}, __, ___) => {
                const poll = (getState() as RootState).poll.poll;
                return {data: poll}
            },
            async onCacheEntryAdded(_, {cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState, dispatch}) {
                const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:8080/polls", {
                        auth: {
                            token: (getState() as RootState).auth.accessToken
                        }
                    });
    
                try {
                    await cacheDataLoaded;

                    
                    socket.on("poll_updated", (poll) =>{
                        updateCachedData(() => {
                            return poll
                        })
                        dispatch(setPoll(poll))
                    });

                    socket.on('error', (error): void => {
                        dispatch(setError(error.message))
                    })

                    socket.on('connect_error', (_): void => {
                        dispatch(setError("Failed to connect to poll"));
                    })

                } catch {
                    //TODO: Set Socket state error here message = Unknown Error Occured
                    
                }

                await cacheEntryRemoved;

                socket.disconnect();
            }
        })
    })
})

export const {useStreamPollUpdatesQuery} = socketSlice;