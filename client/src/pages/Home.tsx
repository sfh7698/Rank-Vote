import { Page } from "react-onsenui";
import { Button } from "../components";
import { Route } from "../utils";
import { CreatePoll, JoinPoll } from "./index";

export default function Home({navigator}: Route["props"]) {

    const createPollRoute: Route = {
        props: {
            key: "CreatePoll",
            navigator
        },
        component: CreatePoll
    }

    const joinPollRoute: Route = {
        props: {
            key: "JoinPoll",
            navigator
        },
        component: JoinPoll
    }

    return (
        <Page>
            <div className="flex flex-col items-center justify-center h-full">
               <h1 className="text-blue-500"> Rank Vote </h1>
                <div className="flex flex-col space-y-4 mt-16">
                    <Button onClick={()=>navigator?.pushPage(createPollRoute)}>
                        Create a Poll
                    </Button>
                    <Button className="text-center" onClick={()=>navigator?.pushPage(joinPollRoute)}>
                        Join a Poll
                    </Button>
                </div>
            </div>
        </Page>
    )
 }