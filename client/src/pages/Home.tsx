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
            <div className="home">
                <h1> Rank Vote </h1>
                {/*
                Button component(s) gives error when adding text to button so ignoring after verifying button functionality works correctly
                Has something to do with Button type declaration in @types/react-onsenui
                @ts-ignore */}
                <Button onClick={()=>goToComponent(navigator, "Create", CreatePoll)} modifier="outline">
                    Create a Poll
                </Button>
                {/* @ts-ignore */}
                <Button onClick={()=>goToComponent(navigator, "Join", JoinPoll)} modifier="outline">
                    Join a Poll
                </Button>
            </div>
        </Page>
    )
 }