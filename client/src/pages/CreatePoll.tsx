import { Page } from "react-onsenui";
import { Button } from "../components";
import { Route } from "../types";

export default function CreatePoll({navigator}: Route["props"]) {
    return (
        <Page>
            <h1> Enter Poll Topic</h1>
            <Button onClick={() => navigator?.popPage()}>
                Back
            </Button>
        </Page>
    )
}