import { selectError, setError } from "../app/slices/errorSlice";
import { Toast, Button } from "../components";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDuration } from "../hooks/useDuration";

interface errorDisplayProps {
    duration?: number
}

export default function ErrorDisplay({duration}: errorDisplayProps) {
    const dispatch = useAppDispatch();

    const error = useAppSelector(selectError);

    useDuration(error, duration);

    return (
        <Toast 
            isOpen={error !== ""} 
            animation="fall" 
            animationOptions={{duration: 0.3, timing: 'ease-in'}}
            >
            <div className="flex flex-row items-center justify-between">
                {error}
                <Button modifier="quiet" onClick={() => dispatch(setError(""))}>
                    Dismiss
                </Button>
            </div>
        </Toast>
    )
}