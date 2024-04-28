import { selectError, setError } from "../app/slices/errorSlice";
import { Toast, Button } from "../components";
import { useAppDispatch, useAppSelector, useErrorDuration } from "../hooks";

interface errorDisplayProps {
    duration?: number
}

export default function ErrorDisplay({duration}: errorDisplayProps) {
    const dispatch = useAppDispatch();

    const error = useAppSelector(selectError);

    useErrorDuration(error, duration);

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