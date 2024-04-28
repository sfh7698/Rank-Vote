import { useEffect, useState } from "react";
import { selectError } from "../app/slices/errorSlice";
import { useAppDispatch, useAppSelector } from ".";
import { emitSocketEvent } from "../app/socketActions";
import { errorResponses } from "../app/slices/errorSlice";

export function useCheckConnection() {
    const [isConnected, setIsConnected] = useState(true);
    const dispatch = useAppDispatch();

    const error = useAppSelector(selectError);

    useEffect(() => {
        if (error === errorResponses.TOKEN_ERROR || error === errorResponses.REMOVED_ERROR || error === errorResponses.CANCELLED_ERROR) {
            setIsConnected(false);
            dispatch(emitSocketEvent({eventName: "disconnect", delay: 2000}));
        }

    }, [error]);

    return isConnected;
}
