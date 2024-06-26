import { Page } from "react-onsenui"
import { Button, Title } from "../components"
import { Route, getErrorMessage, waitingRoomRoute } from "../utils"
import { useState } from "react"
import { z } from "zod";
import { useJoinPollMutation } from "../app/slices/apiSlice";
import { Loader } from ".";
import { useAppDispatch } from "../hooks";
import { setError } from "../app/slices/errorSlice";

export default function JoinPoll({navigator}: Route["props"]) {
    const [pollID, setPollID] = useState('');
    const [name, setName] = useState('');

    const dispatch = useAppDispatch();

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
            navigator?.pushPage(waitingRoomRoute);

        } catch(e) {
            dispatch(setError(getErrorMessage(e)));
        }
    }

    return(
        <Page renderToolbar={() => <Title title="Join Poll"></Title>}>
            {isLoading && <Loader />}
            <hr className="border-gray-400"></hr>
            <div className="flex flex-col w-full items-stretch mx-auto max-w-sm pt-14">
                <div className="flex flex-col items-center mb-12">
                    <label htmlFor="pollID" className="text-xl text-center">Enter Poll ID</label>
                    <input
                        id="pollID"
                        type="text"
                        className="w-64 border-solid rounded border-black border uppercase py-2 px-2"
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
                        className="w-64 border-solid rounded border-black border py-2 px-2"
                        maxLength={25}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="given-name"
                    />
                </div>
                <div className="flex flex-col items-center mt-16 space-y-4">
                    <Button
                        className="text-center"
                        disabled={!parsedFields.success}
                        onClick={handleJoinPoll}
                        >
                        <span className="p-3">Join Poll</span>
                    </Button>
                </div>
            </div>
        </Page>
    )
}