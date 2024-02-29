import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { setError } from "../app/slices/errorSlice";

export function useDuration(error: string, duration: number | undefined){
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (error && duration) {
            const timeoutId = setTimeout(() => {
                dispatch(setError(""));
            }, duration);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [error, duration]);
}
