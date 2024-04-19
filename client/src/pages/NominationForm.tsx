import { Page, BackButton, List, ListItem, Icon } from "react-onsenui";
import { useState } from "react";
import { Button, Toolbar } from "../components";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { selectIsAdmin, selectPoll } from "../app/slices/pollSlice";
import { selectPayloadFromToken } from "../app/slices/authSlice";
import { isJwtPayload } from "../utils";
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

export default function NominationForm() {
    const [nominationText, setNominationText] = useState<string>();

    const poll = useAppSelector(selectPoll);
    const nominations = poll?.nominations ? poll.nominations : {};
    const payload = useAppSelector(selectPayloadFromToken);
    const isAdmin = useAppSelector(selectIsAdmin);

    const dispatch = useAppDispatch();

    const getBoxStyle = (id: string): string => {
        if (isJwtPayload(payload)) {
            if (id === payload.id) {
                return 'bg-orange-100'
            }
            return 'bg-gray-100';
        }
        return ''
    };

    function handleSubmit() {
        if(nominationText) {
            dispatch(emitSocketEvent({eventName: "nominate", data: { text: nominationText }}));
            setNominationText('');
        }
    }

    function handleRemoveNomination(nominationID: string) {
        dispatch(emitSocketEvent({eventName: "remove_nomination", data: {id: nominationID}}));
    }

    return (
        <Page renderToolbar={renderToolbar}>
            <div className="flex flex-col px-6 items-center mb-2">
                <p className="italic text-center text-xl font-semibold">{poll?.topic}</p>
                <div className="mt-2 mb-3 flex flex-col w-full">
                    <label htmlFor="nomination">Enter Nomination</label>
                    <textarea
                    id="nomination"
                    rows={2}
                    maxLength={100}
                    className="border-solid rounded border-black border py-2 px-2 w-full"
                    value={nominationText}
                    onChange={(e) => setNominationText(e.currentTarget.value)}
                    >
                    </textarea>
                </div>
                <Button 
                    disabled={!nominationText?.length}
                    onClick={handleSubmit}>
                    Nominate
                </Button>
                <h2>Nominations</h2>
                <div className="w-full mb-2">
                    <List dataSource={Object.entries(nominations)} renderRow={([nominationID, nomination]) => 
                        <ListItem key={nominationID} className={`${getBoxStyle(nomination.userID)} rounded-md`}>
                            <div className="right">
                                {nomination.text}
                            </div>
                            {isAdmin &&
                            <Button 
                            className="left"
                            modifier="quiet"
                            onClick={() => handleRemoveNomination(nominationID)}>
                                <Icon icon={'md-close-circle'} size={24} className="text-red-600"></Icon>
                            </Button>}
                        </ListItem>}>
                    </List>
                </div>
            </div>
        </Page>
    )

}