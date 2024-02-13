import { Icon } from "react-onsenui";
import { Fab } from ".";
import { useState } from "react";

interface CountSelectorProps {
    onChange?: (val: number) => void,
    initialVotes: number,
    showFab: boolean
}

export default function CountSelector({onChange, initialVotes, showFab}: CountSelectorProps) {
    const minVotes = 1;
    const maxVotes = 5;
    const [count, setCount] = useState(initialVotes);

    const increment = () => {
        setCount(count+1);
        onChange?.(count+1);
    }

    const decrement = () => {
        setCount(count-1);
        onChange?.(count-1);
    }

    return (
        <div className="flex justify-between items-center w-48 mx-auto my-4">
            {showFab && <Fab 
                modifier="mini"
                onClick={decrement}
                disabled={count <= minVotes}
                className="btn-round"
            >
                <Icon icon="fa-minus"></Icon>
            </Fab>}
            <span className="text-2xl font-bold">{count}</span>
            {showFab && <Fab 
                modifier="mini"
                onClick={increment}
                disabled={count >= maxVotes}
                className="btn-round"
            >
                <Icon icon='fa-plus'></Icon>
            </Fab>}
        </div>
    )

}