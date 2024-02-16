import { Page } from "react-onsenui";
import { useStreamPollUpdatesQuery } from "../app/slices/socketSlice";

export default function WaitingRoom() {
    const {data} = useStreamPollUpdatesQuery();

    console.log(data);
    return (
        <Page>
            <div>Waiting Room</div>
        </Page>
    )
}