import { useAppSelector } from "./useAppSelector";
import { selectPoll } from "../app/slices/pollSlice";
import { selectPayloadFromToken } from "../app/slices/authSlice";

export default function useIsAdmin() {
    const payload = useAppSelector(selectPayloadFromToken);

    const poll = useAppSelector(selectPoll);

    return payload?.id === poll?.adminID;
}