import useCopy from "../hooks/useCopy";
import { colorizeText } from "../utils/colorizeText";
import { Icon } from "react-onsenui";

interface PollIdDisplayProps {
    pollId: string
}

export default function PollIdDisplay({pollId}: PollIdDisplayProps) {
    const [copied, copy, setCopied] = useCopy(pollId);

    function handleCopyClick() {
        copy();

        setTimeout(() => {
            setCopied(false);
          }, 2000);
    }

    return (
        <div
        onClick={handleCopyClick}
        className="mb-4 flex flex-col justify-center items-center cursor-pointer"
        >
            <span className="text-center text-2xl mt-4">Poll ID</span>
            <div className="text-center ml-1">
                {colorizeText(pollId+" ")}
                <Icon icon={"md-copy"} size={18}></Icon>
                {copied ?
                <p className="text-center mb-2 text-green-500">Copied!</p> 
                :
                <p className="text-center mb-2">Click to Copy!</p>
                }
            </div>
        </div>
    )
}
