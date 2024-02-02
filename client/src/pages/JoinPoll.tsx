import { Button, Page } from "react-onsenui"
import { Route } from "../types"

export default function JoinPoll({navigator}: Route["props"]) {
    return(
        <Page>
            <h1>Enter Poll ID</h1>
            {/*@ts-ignore */}
            <Button onClick={()=>navigator?.popPage()}>
                Back
            </Button>
        </Page>
    )
}