import { useEffect } from "react";
import { Navigator } from "react-onsenui";
import { useAppSelector } from "./useAppSelector";
import { selectPoll } from "../app/slices/pollSlice";
import { Route, resultsRoute } from "../utils";
import { VotingPage } from "../pages";

export function useWaitForVoting(navigator: Navigator | undefined) {
    const poll = useAppSelector(selectPoll);
    
    useEffect(() => {
        if (poll?.hasStarted) {
            if(Object.keys(poll.results).length === 0) {
                const votingPageRoute: Route = {
                    props: {
                        key: "VotingPage",
                        navigator,
                    },
                    component: VotingPage
                }
                navigator?.pushPage(votingPageRoute)
            } else {
                navigator?.pushPage(resultsRoute);
            }
        }
    }, [poll?.hasStarted]);

}