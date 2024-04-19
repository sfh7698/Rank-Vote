import { Page, Icon} from "react-onsenui";
import { Route } from "../utils";
import { useCheckConnection } from "../hooks/useCheckConnection";
import { Loader, ParticipantPage, NominationForm } from ".";
import { useInitializeSocket } from "../hooks/useInitializeSocket";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectPoll, 
        selectParticipantCount, 
        selectNominationCount, 
        selectCanStartVote, 
        selectIsAdmin,
        selectNumUsersNominated } from "../app/slices/pollSlice";
import { PollIdDisplay, Button, ConfirmationDialog } from "../components";
import { useState, useRef } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { emitSocketEvent } from "../app/socketActions";
import { useWaitForVoting } from "../hooks/useWaitForVoting";

export default function WaitingRoom({navigator}: Route["props"]) {
    useInitializeSocket();

    useWaitForVoting(navigator);
    
    const isConnecting =  useCheckConnection();

    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
    const [showStartConfirmation, setShowStartConfirmation] = useState(false);
    const messageRef = useRef("");
    
    const poll = useAppSelector(selectPoll);
    const participantCount = useAppSelector(selectParticipantCount);
    const nominationCount = useAppSelector(selectNominationCount);
    const canVote = useAppSelector(selectCanStartVote);
    const isAdmin = useAppSelector(selectIsAdmin);
    const numUsersNominated = useAppSelector(selectNumUsersNominated);

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

    function sendSocketEvent() {
        dispatch(emitSocketEvent({eventName: "start_vote"}));
        setShowStartConfirmation(false);
    }

    function handleLeavePoll() {
        dispatch(emitSocketEvent({eventName: "disconnect", delay: 0}));
        setShowLeaveConfirmation(false);
    }

    function handleStartVoting(){
        if(numUsersNominated !== participantCount) {
            const nonNominatedUsers = participantCount - numUsersNominated;
            if (nonNominatedUsers > 1) {
                messageRef.current = `${nonNominatedUsers} users have not voted! Start Voting?`
            } else {
                messageRef.current = `${nonNominatedUsers} user has not voted!\nStart Voting?`
            }

            setShowStartConfirmation(true);
            return
        }
        sendSocketEvent();
    }

    return (
        <>
            <ConfirmationDialog
            message="You will be kicked from the poll"
            showDialog={showLeaveConfirmation}
            onConfirm={handleLeavePoll}
            setShowDialog={setShowLeaveConfirmation}
            />
            <ConfirmationDialog
            message={messageRef.current}
            showDialog={showStartConfirmation}
            onConfirm={sendSocketEvent}
            setShowDialog={setShowStartConfirmation}
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
                        <div className="my-2 italic text-center">
                            <p>{numUsersNominated} of {participantCount} users have submitted nominations!</p>
                            <p>{poll?.votesPerVoter} nominations required to start!</p>
                        </div>
                        <div className="mb-2">
                            <Button
                                className="w-full text-center"
                                disabled={!canVote}
                                onClick={handleStartVoting}
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
                                onClick={() => setShowLeaveConfirmation(true)}>
                                Leave Poll
                            </Button>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}