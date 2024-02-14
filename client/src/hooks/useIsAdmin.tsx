import { useSelector } from "react-redux";
import { selectPoll } from "../app/slices/pollSlice";
import { selectUserFromToken } from "../app/slices/authSlice";

export default function useIsAdmin() {
    const userInfo = useSelector(selectUserFromToken);

    const poll = useSelector(selectPoll);

    return userInfo?.id === poll?.adminID;
}