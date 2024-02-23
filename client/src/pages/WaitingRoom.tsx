import { Page } from "react-onsenui";
import { useStreamPollUpdatesQuery } from "../app/slices/socketSlice";
import { Route } from "../utils";

export default function WaitingRoom({navigator}: Route["props"]) {
    const {data} = useStreamPollUpdatesQuery();

    if (!data) {
        navigator?.popPage();
    }
    return (
        <Page>
            <div>Waiting Room</div>
        </Page>
    )
}