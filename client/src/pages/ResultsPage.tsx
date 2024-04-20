import { Page } from "react-onsenui";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { selectPoll, selectRankingsCount, selectParticipantCount, selectIsAdmin } from "../app/slices/pollSlice";
import { Button, ConfirmationDialog, ResultCard } from "../components";
import { emitSocketEvent } from "../app/socketActions";

export default function Results() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showLeavePoll, setShowLeavePoll] = useState(false);

    const dispatch = useAppDispatch();

    const poll = useAppSelector(selectPoll);
    const rankingsCount = useAppSelector(selectRankingsCount);
    const participantCount = useAppSelector(selectParticipantCount);
    const isAdmin = useAppSelector(selectIsAdmin);

    function handleEndPoll() {
        dispatch(emitSocketEvent({eventName: "close_poll"}))
        setShowConfirmation(false);
    }

    function handleLeavePoll() {
        dispatch(emitSocketEvent({eventName: "disconnect", delay: 0}))
        setShowLeavePoll(false);
    }

    return (
        <Page>
            <div className="mx-auto flex flex-col w-full justify-between items-center h-full max-w-sm">
                <div className="w-full mt-12">
                    <h1 className="text-center">Results</h1>
                    {poll?.results.length ? 
                        <ResultCard results={poll.results}/>
                    : 
                        <p className="text-center text-xl">
                            <span className="text-orange-600">{rankingsCount}</span> of{' '}
                            <span className="text-purple-600">{participantCount} </span> 
                            participants have voted
                        </p>
                    }
                </div>
                <div className="flex flex-col justify-center">
                    {isAdmin ?
                        (!poll?.results.length &&
                            <div className="my-2">
                                <Button
                                onClick={() => setShowConfirmation(true)}>
                                    End Poll
                                </Button>
                            </div>
                        )
                    :
                        (!poll?.results.length && 
                            <div className="my-2 italic">
                                Waiting for Admin, 
                                <span className="font-semibold">
                                    {poll?.participants[poll.adminID]}
                                </span>
                                , to finalize the poll
                            </div>
                        )}
                        {!!poll?.results.length && 
                            <div className="my-2">
                                <Button
                                onClick={() => setShowLeavePoll(true)}>
                                    Leave Poll
                                </Button>
                            </div>
                        }
                </div>
            </div>
            {isAdmin && 
                <ConfirmationDialog
                message="Close poll and calculate results?"
                showDialog={showConfirmation}
                setShowDialog={setShowConfirmation}
                onConfirm={handleEndPoll} 
                />
            }
            {showLeavePoll && 
                <ConfirmationDialog
                message="If you leave you will lose your results!"
                showDialog={showLeavePoll}
                setShowDialog={setShowLeavePoll}
                onConfirm={handleLeavePoll}
                />
            }
        </Page>
    )
}