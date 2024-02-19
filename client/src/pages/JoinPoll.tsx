import { Page } from "react-onsenui"
import { Button, ErrorDisplay } from "../components"
import { Route, goToPage, getErrorMessage } from "../utils"
import { useState } from "react"
import {z} from "zod";
import { useJoinPollMutation } from "../app/slices/apiSlice";
import {Loader, WaitingRoom} from ".";

export default function JoinPoll({navigator}: Route["props"]) {
    const [pollID, setPollID] = useState('');
    const [name, setName] = useState('');
    const [apiError, setApiError] = useState('');
    const [showError, setShowError] = useState(false);

    const [joinPoll, {isLoading}] = useJoinPollMutation();

    const formFieldsSchema = z.object({
        pollID: z.string().length(6),
        name: z.string().min(1).max(25)
    });

    const formFields = {
        pollID,
        name
    }

    const parsedFields = formFieldsSchema.safeParse(formFields);

    const handleJoinPoll = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        if(!parsedFields.success){
            return
        }

        try {
            await joinPoll(parsedFields.data).unwrap();
            goToPage(navigator, "Waiting", WaitingRoom);

        } catch(e) {
            setApiError(getErrorMessage(e));
            setShowError(true);
        }
    }

    return(
        <Page>
            {isLoading && <Loader />}
            <ErrorDisplay showError={showError} setShowError={setShowError} error={apiError}/>
            <div className="flex flex-col w-full items-stretch h-full mx-auto max-w-sm py-36">
                <div className="flex flex-col items-center mb-12">
                    <label htmlFor="pollID" className="text-xl text-center">Enter Poll ID</label>
                    <input
                        id="pollID"
                        type="text"
                        className="w-64 border-solid rounded border-black border uppercase"
                        autoCapitalize="characters"
                        maxLength={6}
                        onChange={(e) => setPollID(e.target.value.toUpperCase())}
                    />
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="name" className="text-xl text-center"> Enter Name </label>
                    <input 
                        type="text"
                        id="name"
                        className="w-64 border-solid rounded border-black border"
                        maxLength={25}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="given-name"
                    />
                </div>
                <div className="flex flex-col items-center mt-16 space-y-4">
                    <Button
                        modifier="outline"
                        className="w-24 text-center"
                        disabled={!parsedFields.success}
                        onClick={handleJoinPoll}
                        >
                        Join Poll
                    </Button>
                    <Button
                        modifier="outline"
                        onClick={()=> navigator?.popPage()}
                        >
                        Start Over
                    </Button>
                </div>
            </div>
        </Page>
    )
}