import { Page, BackButton, Icon } from "react-onsenui";
import { Card, Toolbar, ConfirmationDialog, Button} from "../components";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectPoll, selectIsAdmin } from "../app/slices/pollSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { emitSocketEvent } from "../app/socketActions";
import { useState } from "react";

function renderToolbar() {
    return (
        <Toolbar modifier="transparent">
            <div className="left">
                <BackButton></BackButton>
            </div>
            <div className="center">
                <h3>Participants</h3>
            </div>
        </Toolbar>

    )
}

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
            <Page renderToolbar={renderToolbar}>
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