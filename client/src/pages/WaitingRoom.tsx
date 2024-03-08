import { Page, Icon} from "react-onsenui";
import { Route } from "../utils";
import { useCheckConnection } from "../hooks/useCheckConnection";
import { Loader, ParticipantPage, NominationForm } from ".";
import { useInitializeSocket } from "../hooks/useInitializeSocket";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectPoll, selectParticipantCount, selectNominationCount, selectCanStartVote } from "../app/slices/pollSlice";
import { PollIdDisplay, Button, ConfirmationDialog } from "../components";
import useIsAdmin from "../hooks/useIsAdmin";
import { useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { emitSocketEvent } from "../app/socketActions";
import { useWaitForVoting } from "../hooks/useWaitForVoting";

export default function WaitingRoom({navigator}: Route["props"]) {
    useInitializeSocket();

    useWaitForVoting(navigator);
    
    const isConnecting =  useCheckConnection();

    const [showConfirmation, setShowConfirmation] = useState(false);
    
    const poll = useAppSelector(selectPoll);
    const participantCount = useAppSelector(selectParticipantCount);
    const nominationCount = useAppSelector(selectNominationCount);
    const canVote = useAppSelector(selectCanStartVote);
    const isAdmin = useIsAdmin();
    const pollId = poll?.id !== undefined ? poll.id : "";
    
    const dispatch = useAppDispatch();

    const participantPageRoute: Route = {
        props: {
            key: "Participants",
            navigator
        },
        component: ParticipantPage
    }

    const nominationPageRoute: Route = {
        props: {
            key: "Nomination",
            navigator
        },
        component: NominationForm
    }

    function handleLeavePoll() {
        dispatch(emitSocketEvent({eventName: "disconnect", delay: 0}));
        setShowConfirmation(false);
    }

    return (
        <>
            <ConfirmationDialog
            message="You will be kicked from the poll"
            showDialog={showConfirmation}
            onConfirm={handleLeavePoll}
            setShowDialog={setShowConfirmation}
            />
            <Page>
                {(isConnecting && !poll) && <Loader />}
                <div className="flex flex-col w-full justify-between items-center h-full">
                    <div className="flex flex-col mt-8">
                        <span className="text-center text-2xl">Poll Topic</span>
                        <p className="italic text-center mb-4 text-xl">{poll?.topic}</p>
                        <PollIdDisplay pollId={pollId}/>
                    </div>
                    <div className="flex justify-center">
                        <div className="mx-2">
                            <Button modifier="outline" onClick={() => navigator?.pushPage(participantPageRoute)}>
                                <div className="flex flex-col items-center">
                                    <Icon className="mx-2" icon={"fa-users"} size={24}></Icon>
                                    <span>{participantCount}</span>
                                </div>
                            </Button>
                        </div>
                        <div className="mx-2">
                            <Button modifier="outline" onClick={() => navigator?.pushPage(nominationPageRoute)}>
                                <div className="flex flex-col items-center">
                                    <Icon className="mx-2 ml-3" icon={"fa-edit"} size={28}></Icon>
                                    <span>{nominationCount}</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div>
                        {isAdmin ? 
                        <>
                        <div className="my-2 italic">
                            {poll?.votesPerVoter} nominations required to start!
                        </div>
                        <div className="mb-2">
                            <Button
                                className="w-full text-center"
                                modifier="outline"
                                disabled={!canVote}
                                onClick={() => dispatch(emitSocketEvent({eventName: "start_vote"}))}
                                >
                                Start Voting
                            </Button>
                        </div>
                        </>
                        : 
                        <div className="my-2 italic">
                            Waiting for Admin, {" "}
                            <span className="font-semibold">
                                {poll?.participants[poll.adminID]}      
                            </span>
                            , to start voting.
                        </div>
                        }
                        <div className="mb-2">
                            <Button 
                                className="w-full text-center"
                                onClick={() => setShowConfirmation(true)}>
                                Leave Poll
                            </Button>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}