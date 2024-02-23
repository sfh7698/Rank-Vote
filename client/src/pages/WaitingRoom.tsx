import { Page } from "react-onsenui";
import { useStreamPollUpdatesQuery } from "../app/slices/socketSlice";
import { Route } from "../utils";
import { homeRoute } from "../App";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectError } from "../app/slices/errorSlice";
import { useEffect } from "react";

export default function WaitingRoom({navigator}: Route["props"]) {
    const {data} = useStreamPollUpdatesQuery();

    console.log(data);

    const error = useAppSelector(selectError);
    //TODO: create custom hook for this useEffect and popPage if invalid token
    useEffect(() => {
        if (error === "Failed to connect to poll") {
            navigator?.resetPage(homeRoute);
        }

    }, [error]);

    return (
        <Page>
            <div>Waiting Room</div>
        </Page>
    )
}