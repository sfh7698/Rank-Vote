import { AlertDialog, AlertDialogButton } from ".";

interface ConfirmationDialogProps {
    showDialog: boolean,
    setShowDialog: (trigger: boolean) => void,
    message: string,
    onConfirm: () => void
}

export default function ConfirmationDialog({showDialog, setShowDialog, message, onConfirm}: ConfirmationDialogProps) {

    return (
        <AlertDialog isOpen={showDialog} isCancelable={true} onCancel={() => setShowDialog(false)}>
            <div className="flex justify-center">
                {message}
            </div>
            <div className="flex">
                <AlertDialogButton onClick={() => setShowDialog(false)}>Cancel</AlertDialogButton>
                <AlertDialogButton onClick={() => onConfirm()}>Confirm</AlertDialogButton>
            </div>
        </AlertDialog>
    )
}