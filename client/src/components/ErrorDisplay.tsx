import { Toast, Button } from "../components";

interface ErrorDisplayProps {
    setShowError: (toggle: boolean) => void,
    showError: boolean,
    error: string
}

export default function ErrorDisplay({setShowError, showError, error}: ErrorDisplayProps) {
    return (
        <Toast 
            isOpen={showError} 
            animation="fall" 
            animationOptions={{duration: 0.3, timing: 'ease-in'}}
            >
            <div className="flex flex-row items-center justify-between">
                {error}
                <Button modifier="quiet" onClick={()=>setShowError(false)}>
                    Dismiss
                </Button>
            </div>
        </Toast>
    )
}