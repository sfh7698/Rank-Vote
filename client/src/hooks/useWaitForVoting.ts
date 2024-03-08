import { useEffect } from "react";
import { Navigator } from "react-onsenui";
import { useAppSelector } from "./useAppSelector";
import { selectPoll } from "../app/slices/pollSlice";
import { Route } from "../utils";
import VotingPage from "../pages/VotingPage";

export function useWaitForVoting(navigator: Navigator | undefined) {
    const poll = useAppSelector(selectPoll);
    
    useEffect(() => {
        if (poll?.hasStarted) {
            const votingPageRoute: Route = {
                props: {
                    key: "VotingPage",
                    navigator,
                },
                component: VotingPage
            }
            navigator?.pushPage(votingPageRoute)
        }
    }, [poll?.hasStarted]);

}