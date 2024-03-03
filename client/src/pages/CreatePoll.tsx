import { useCreatePollMutation } from "../app/slices/apiSlice";
import { CountSelector, Button} from "../components";
import { Loader } from ".";
import { Page } from "react-onsenui";
import { Route, getErrorMessage, waitingRoomRoute } from "../utils";
import { useState } from "react";
import { z } from "zod";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setError } from "../app/slices/errorSlice";


export default function CreatePoll({navigator}: Route["props"]) {
    const [pollTopic, setPollTopic] = useState('');
    const [votes, setVotes] = useState(3);
    const [name, setName] = useState('');
    const [showFab, setShowFab] = useState(true);

    const dispatch = useAppDispatch();
    
    const [createPoll, {isLoading}] = useCreatePollMutation();

    const formFieldsSchema = z.object({
        topic: z.string().min(1).max(100),
        votesPerVoter: z.number().min(1).max(5),
        name: z.string().min(1).max(25)
    });

    const formFields = {
        topic: pollTopic,
        votesPerVoter: votes,
        name
    }

    const parsedFields = formFieldsSchema.safeParse(formFields);

    const handleSubmit = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        if(!parsedFields.success){
            return
        }

        try {
            setShowFab(false);
            await createPoll(parsedFields.data).unwrap();
            navigator?.pushPage(waitingRoomRoute);

        } catch (e){
            setShowFab(true);
            dispatch(setError(getErrorMessage(e)));
        }
    }
    
    return (
        <Page>
            {isLoading && <Loader />}
            <div className="flex flex-col items-stretch mx-auto max-w-sm py-36 h-screen w-full">
                <div className="flex flex-col items-center mb-4">
                    <label htmlFor="pollTopic" className="text-xl text-center"> Enter Poll Topic</label>
                    <input
                        maxLength={100}
                        id="pollTopic"
                        type="text"
                        className="w-64 border-solid rounded border-black border"
                        onChange={e => setPollTopic(e.target.value)}
                        >
                    </input>
                </div>
                <div className="mb-4">
                    <h3 className="text-center"> Votes Per Participant </h3>
                    <CountSelector 
                    onChange={setVotes}
                    initialVotes={votes}
                    showFab={showFab}
                    />
                </div>
                <div className="flex flex-col items-center mb-4">
                    <label htmlFor="name" className="text-xl text-center"> Enter Name </label>
                    <input
                        type="text"
                        id="name"
                        maxLength={25}
                        autoComplete="given-name"
                        className="w-64 border-solid rounded border-black border"
                        onChange={e => setName(e.target.value)}
                        >
                    </input>
                </div>
                <div className="flex flex-col items-center mt-16 space-y-4">
                    <Button 
                        modifier="outline" 
                        className="w-24 text-center"
                        disabled={!parsedFields.success}
                        onClick={handleSubmit}
                        >
                        Create
                    </Button>
                    <Button 
                        modifier="outline"
                        onClick={()=>navigator?.popPage()}
                        >
                        Start Over
                    </Button>
                </div>
            </div>
        </Page>
    )
}