import { Page } from "react-onsenui";
import { useStreamPollUpdatesQuery } from "../app/slices/socketSlice";
import { Route } from "../utils";
import { useCheckConnection } from "../hooks/useCheckConnection";

export default function WaitingRoom({navigator}: Route["props"]) {
    const {data} = useStreamPollUpdatesQuery();

    console.log(data);

    useCheckConnection(navigator);

    return (
        <Page>
            <div>Waiting Room</div>
        </Page>
    )
}