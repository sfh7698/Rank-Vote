import { Page } from "react-onsenui"
import { Button } from "../components"
import { Route } from "../types"

export default function JoinPoll({navigator}: Route["props"]) {
    return(
        <Page>
            <h1>Enter Poll ID</h1>
            <Button onClick={()=>navigator?.popPage()}>
                Back
            </Button>
        </Page>
    )
}