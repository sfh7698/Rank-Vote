import { useAppSelector } from "./useAppSelector";
import { selectPoll } from "../app/slices/pollSlice";
import { selectPayloadFromToken } from "../app/slices/authSlice";
import { isJwtPayload } from "../utils";

export default function useIsAdmin() {
    const payload = useAppSelector(selectPayloadFromToken);

    const poll = useAppSelector(selectPoll);

    return isJwtPayload(payload) ? payload?.id === poll?.adminID : false;
}