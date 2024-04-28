import { Page, Icon } from "react-onsenui";
import { Card, ConfirmationDialog, Button, Title} from "../components";
import { useAppSelector, useAppDispatch } from "../hooks";
import { selectPoll, selectIsAdmin } from "../app/slices/pollSlice";
import { emitSocketEvent } from "../app/socketActions";
import { useState } from "react";

export default function ParticipantPage() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [participantName, setParticipant] = useState('');
    const [participantID, setParticipantID] = useState('');

    const poll = useAppSelector(selectPoll);
    const participants = poll?.participants;
    const isAdmin = useAppSelector(selectIsAdmin);

    const dispatch = useAppDispatch();

    function removeParticipant() {
        if (participantID !== "") {
            dispatch(emitSocketEvent({eventName: "remove_participant", data: { id: participantID }}));
            setShowConfirmation(false);
        }
    }

    function handleShowConfirmation(id: string){
        participants && setParticipant(participants[id]);
        setParticipantID(id);
        setShowConfirmation(true);
    }

    return (
        <>
            <ConfirmationDialog 
            showDialog={showConfirmation} 
            message={`Remove ${participantName} from poll?`}
            setShowDialog={setShowConfirmation}
            onConfirm={removeParticipant}
            />
            <Page renderToolbar={() => <Title title="Participants"></Title>}>
                <hr className="border-gray-400"></hr>
                <div className="px-8 flex flex-wrap justify-center mb-2">
                    {participants && Object.entries(participants).map(([id, name]) =>
                        <Card key={id}>
                            <div className="flex justify-center">
                                <p className="m-2">{name}</p>
                                {(isAdmin && poll?.adminID !== id) && 
                                    <Button modifier="quiet" onClick={() => handleShowConfirmation(id)}>
                                        <Icon icon={"fa-close"} size={20} className="mt-1 text-red-600"></Icon>
                                    </Button>
                                }
                            </div>
                        </Card>
                    )}
                </div>
            </Page>
        </>
    )
}