import { useEffect } from "react";
import { initializeSocket } from "../app/socketActions";
import { useAppDispatch } from "../hooks/useAppDispatch";

export function useInitializeSocket(){
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(initializeSocket());
    }, []);
}