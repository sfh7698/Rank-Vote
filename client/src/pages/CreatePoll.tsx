import { Page, Button } from "react-onsenui";
import { Route } from "../types";

export default function CreatePoll({navigator}: Route["props"]) {
    return (
        <Page>
            <h1> Enter Poll Topic</h1>
            {/*@ts-ignore */}
            <Button onClick={() => navigator?.popPage()}>
                Back
            </Button>
        </Page>
    )
}