import { Page, Button, Navigator } from "react-onsenui";
import { Route } from "../types";
import { CreatePoll, JoinPoll } from "./index";

export default function Home({navigator}: Route["props"]) {

    const goToComponent = (navigator: Navigator, key: string, component: Route["component"]) => {

        const route: Route = {
            props: {
                key,
                navigator
            },
            component
        }

            navigator.pushPage(route)
        }

    return (
        <Page>
            <div className="flex flex-col items-center justify-center h-full">
                <h1> Rank Vote </h1>
                <div className="flex flex-col space-y-4">
                    {/* @ts-ignore */}
                    <Button onClick={()=>goToComponent(navigator, "Create", CreatePoll)} modifier="outline">
                        Create a Poll
                    </Button>
                    {/* @ts-ignore */}
                    <Button className="text-center" onClick={()=>goToComponent(navigator, "Join", JoinPoll)} modifier="outline">
                        Join a Poll
                    </Button>
                </div>
            </div>
        </Page>
    )
 }