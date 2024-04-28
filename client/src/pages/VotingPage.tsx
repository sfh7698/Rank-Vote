import { Page} from "react-onsenui";
import { useAppSelector, useAppDispatch } from "../hooks";
import { selectIsAdmin, selectPoll } from "../app/slices/pollSlice";
import { useState } from "react"
import { Button, RankedNomination, ConfirmationDialog } from "../components";
import { emitSocketEvent } from "../app/socketActions";
import { Route, resultsRoute } from "../utils";

export default function VotingPage({navigator}: Route["props"]){
    const [rankings, setRankings] = useState<string[]>([]);
    const [showConfirmVotes, setShowConfirmVotes] = useState(false);
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);

    const poll = useAppSelector(selectPoll);
    const isAdmin = useAppSelector(selectIsAdmin);

    const dispatch = useAppDispatch();

    const toggleNomination = (id: string) => {
        const position = rankings.findIndex((ranking) => ranking === id);
        const hasVotesRemaining = (poll?.votesPerVoter || 0) - rankings.length > 0;
    
        if (position < 0 && hasVotesRemaining) {
          setRankings([...rankings, id]);

        } else if (rankings.includes(id)) {
            setRankings([
              ...rankings.slice(0, position),
              ...rankings.slice(position + 1, rankings.length),
            ]);
        }
      };

    const getRank = (id: string) => {
        const position = rankings.findIndex((ranking) => ranking === id);
    
        return position < 0 ? undefined : position + 1;
    };

    const handleSubmitRankings = () => {
        dispatch(emitSocketEvent({eventName: "submit_rankings", data: {rankings}}));
        setShowConfirmVotes(false);
        navigator?.pushPage(resultsRoute);
    }
    
    return(
        <>
            <ConfirmationDialog 
            showDialog={showConfirmVotes} 
            setShowDialog={setShowConfirmVotes}
            message={"You cannot change your vote after submitting"} 
            onConfirm={handleSubmitRankings}
            />
            <Page>
                <div className="mx-auto flex flex-col w-full items-center h-full max-w-sm">
                    <div>
                        <h1 className="text-center">Voting Page</h1>
                    </div>
                    <div className="w-full">
                        {poll && (
                        <div>
                            <div className="text-center text-xl font-semibold mb-6">
                                Select Your Top {poll.votesPerVoter} Choices
                            </div>
                            <div className="text-center text-lg font-semibold mb-6 text-indigo-700">
                                {poll.votesPerVoter - rankings.length} Votes remaining
                            </div>
                        </div>
                        )}
                    </div>
                    <div className="px-2 overflow-y-auto w-full">
                        {Object.entries(poll?.nominations || {}).map(([id, nomination]) =>
                            <RankedNomination 
                            key={id}
                            rank={getRank(id)}
                            nominationText={nomination.text} 
                            onSelect={() => toggleNomination(id)}                            
                            /> 
                        )}
                    </div>
                    <div className="mx-auto flex flex-col items-center">
                        <div className="my-2">
                            <Button
                            disabled={poll?.votesPerVoter ? rankings.length < poll?.votesPerVoter: false}
                            onClick={() => setShowConfirmVotes(true)}
                            className="w-36 text-center"
                            >
                                Submit Votes
                            </Button>
                        </div>
                        {isAdmin &&
                            <>
                                <ConfirmationDialog
                                message="This will cancel the poll and remove all users"
                                showDialog={showConfirmCancel}
                                setShowDialog={setShowConfirmCancel}
                                onConfirm={() => dispatch(emitSocketEvent({eventName: "cancel_poll"}))}
                                />
                                <div className="my-2">
                                    <Button
                                    className="w-36 text-center"
                                    onClick={() => setShowConfirmCancel(true)}
                                    >
                                        Cancel Poll
                                    </Button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </Page>
        </>
    )
}