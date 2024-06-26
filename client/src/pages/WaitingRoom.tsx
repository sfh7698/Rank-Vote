import { Page, Icon} from "react-onsenui";
import { Route } from "../utils";
import { useCheckConnection, 
        useInitializeSocket, 
        useAppSelector, 
        useAppDispatch, 
        useWaitForVoting } from "../hooks";
import { Loader, ParticipantPage, NominationForm } from ".";
import { selectPoll, 
        selectParticipantCount, 
        selectNominationCount, 
        selectCanStartVote, 
        selectIsAdmin,
        selectNumUsersNominated } from "../app/slices/pollSlice";
import { PollIdDisplay, Button, ConfirmationDialog } from "../components";
import { useState, useRef } from "react";
import { emitSocketEvent } from "../app/socketActions";

export default function WaitingRoom({navigator}: Route["props"]) {
    useInitializeSocket();

    useWaitForVoting(navigator);
    
    const isConnecting =  useCheckConnection();

    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
    const [showStartConfirmation, setShowStartConfirmation] = useState(false);
    
    const nominatedUsersMessageRef = useRef("");
    const leaveMessageRef = useRef("You will be kicked from the poll");
    
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

    function sendStartVoteEvent() {
        dispatch(emitSocketEvent({eventName: "start_vote"}));
        setShowStartConfirmation(false);
    }

    function handleLeavePoll() {
        if(isAdmin) {
            dispatch(emitSocketEvent({eventName: "cancel_poll"}));
        } else {
            dispatch(emitSocketEvent({eventName: "disconnect", delay: 0}));
        }
        setShowLeaveConfirmation(false);
    }

    function handleStartVoting(){
        if(numUsersNominated !== participantCount) {
            const nonNominatedUsers = participantCount - numUsersNominated;
            if (nonNominatedUsers > 1) {
                nominatedUsersMessageRef.current = `${nonNominatedUsers} users have not voted! Start Voting?`
            } else {
                nominatedUsersMessageRef.current = `${nonNominatedUsers} user has not voted!\nStart Voting?`
            }

            setShowStartConfirmation(true);
            return
        }
        sendStartVoteEvent();
    }

    function showConfirmation() {
        if(isAdmin) {
            leaveMessageRef.current = "If you leave, the poll will be cancelled. Proceed?"
        }
        setShowLeaveConfirmation(true);
    }

    return (
        <>
            <ConfirmationDialog
            message={leaveMessageRef.current}
            showDialog={showLeaveConfirmation}
            onConfirm={handleLeavePoll}
            setShowDialog={setShowLeaveConfirmation}
            />
            <ConfirmationDialog
            message={nominatedUsersMessageRef.current}
            showDialog={showStartConfirmation}
            onConfirm={sendStartVoteEvent}
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
                                onClick={showConfirmation}>
                                Leave Poll
                            </Button>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}