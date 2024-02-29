import { Page } from "react-onsenui";
import { Route } from "../utils";
import { useCheckConnection } from "../hooks/useCheckConnection";
import { Loader } from ".";
import { useInitializeSocket } from "../hooks/useInitializeSocket";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectPoll } from "../app/slices/pollSlice";

export default function WaitingRoom({navigator}: Route["props"]) {
    useInitializeSocket();

    const isConnecting =  useCheckConnection(navigator);

    const poll = useAppSelector(selectPoll);

    return (
        <Page>
            {(isConnecting && !poll) && <Loader />}
            <div>Waiting Room</div>
        </Page>
    )
}