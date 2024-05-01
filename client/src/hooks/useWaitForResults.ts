import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from ".";
import { selectPayloadFromToken } from "../app/slices/authSlice";
import { selectPoll } from "../app/slices/pollSlice";
import { setError } from "../app/slices/errorSlice";
import { isJwtPayload } from "../utils";

export function useWaitForResults() {
    const poll = useAppSelector(selectPoll);
    const usersHaveRanked = Object.keys(poll?.rankings || {});
    const payload = useAppSelector(selectPayloadFromToken);

    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if(poll?.results && Object.keys(poll?.results).length > 0 && isJwtPayload(payload) && !usersHaveRanked.includes(payload.id)) {
            dispatch(setError("Admin has ended voting"));
            const timeout = setTimeout(() => {
                location.reload()
            }, 3000);
    
            return () => clearTimeout(timeout);
        }
    });
}