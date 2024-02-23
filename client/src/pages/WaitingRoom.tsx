import { Page } from "react-onsenui";
import { useStreamPollUpdatesQuery } from "../app/slices/socketSlice";
import { Route } from "../utils";
import { useCheckConnection } from "../hooks/useCheckConnection";
import { Loader } from ".";

export default function WaitingRoom({navigator}: Route["props"]) {
    const {data} = useStreamPollUpdatesQuery();

    console.log(data);

    const isLoading = useCheckConnection(navigator);

    return (
        <Page>
            {(isLoading && !data) && <Loader />}
            <div>Waiting Room</div>
        </Page>
    )
}