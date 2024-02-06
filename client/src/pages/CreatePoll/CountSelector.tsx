import { Icon } from "react-onsenui";
import { Fab } from "../../components";
import { useState } from "react";

interface CountSelectorProps {
    min: number,
    max: number,
    initial: number,
    onChange?: (val: number) => void
}

export default function CountSelector({max, min, initial}: CountSelectorProps) {
    const [count, setCount] = useState(initial);

    return (
        <div className="flex justify-between items-center w-48 mx-auto my-4">
            <Fab 
                modifier="mini"
                onClick={() => setCount(count - 1)}
                disabled={count == min}>
                <Icon icon="fa-minus"></Icon>
            </Fab>
            <span className="text-2xl font-bold">{count}</span>
            <Fab 
                modifier="mini"
                onClick={()=> setCount(count + 1)}
                disabled={count === max}>
                <Icon icon='fa-plus'></Icon>
            </Fab>
        </div>
    )

}