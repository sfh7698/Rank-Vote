import { Page } from "react-onsenui";
import { Button } from "../components";
import { Route } from "../utils/types";
import { CreatePoll, JoinPoll } from "./index";
import goToPage from "../utils/goToPage";

export default function Home({navigator}: Route["props"]) {

    return (
        <Page>
            <div className="flex flex-col items-center justify-center h-full">
                <h1> Rank Vote </h1>
                <div className="flex flex-col space-y-4 mt-16">
                    <Button onClick={()=>goToPage(navigator, "Create", CreatePoll)} modifier="outline">
                        Create a Poll
                    </Button>
                    <Button className="text-center" onClick={()=>goToPage(navigator, "Join", JoinPoll)} modifier="outline">
                        Join a Poll
                    </Button>
                </div>
            </div>
        </Page>
    )
 }