import { createListenerMiddleware } from "@reduxjs/toolkit/react";
import { AppDispatch, RootState } from "../store";

const authMiddleware = createListenerMiddleware();

authMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    predicate: (_, curState, prevState) => {
        return curState.auth.accessToken !== prevState.auth.accessToken

    },
    effect: (_, {getState}) => {
        const token = getState().auth.accessToken;
        if(token){
            localStorage.setItem('accessToken', token);
        }

    }
});

export default authMiddleware;