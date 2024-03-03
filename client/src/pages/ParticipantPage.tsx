import { Page, BackButton, Icon } from "react-onsenui";
import { Card, Toolbar } from "../components";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectPoll } from "../app/slices/pollSlice";
import useIsAdmin from "../hooks/useIsAdmin";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { emitSocketEvent } from "../app/socketActions";

function renderToolbar() {
    return (
        <Toolbar modifier="transparent">
            <div>
                <BackButton></BackButton>
            </div>
        </Toolbar>

    )
}

export default function ParticipantPage() {
    const poll = useAppSelector(selectPoll);
    const participants = poll?.participants;
    const adminId = poll?.adminID;
    const isAdmin = useIsAdmin();

    const dispatch = useAppDispatch();

    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string){
        e.preventDefault();
        dispatch(emitSocketEvent({eventName: "remove_participant", data: { id }}));
    }

    return (
        <Page renderToolbar={renderToolbar}>
            <h2 className="text-center">Participants</h2>
            <hr className="border-gray-400"></hr>
            <div className="px-8 flex flex-wrap justify-center mb-2">
                {participants && Object.entries(participants).map(([id, name]) =>
                    <Card key={id}>
                        <div className="flex justify-center" onClick={(e) => handleClick(e, id)}>
                            <p className="m-2">{name}</p>
                            {(isAdmin && adminId !== id)
                                && <Icon icon={"fa-close"} size={20} className="mt-1 text-red-600"></Icon>}
                        </div>
                    </Card>
                )}
            </div>
        </Page>
    )
}