import React from "react";
import { 
    Button as OnsButton,
    Fab as OnsFab,
    Toast as OnsToast,
    Card as OnsCard,
    Toolbar as OnsToolBar,
    AlertDialog as OnsAlertDialog,
    AlertDialogButton as OnsAlertDialogButton,
    Row as OnsRow,
    Col as OnsCol
    } from "react-onsenui";

function addChildrenProp<T extends React.ComponentType<any>>(component: T) {

    const WithChildren: React.ComponentType<React.ComponentProps<T> & { children?: React.ReactNode }> = (props) => {
        return React.createElement(component, props);
    };

    return WithChildren;
}

export const Button = addChildrenProp(OnsButton);
export const Fab = addChildrenProp(OnsFab);
export const Toast = addChildrenProp(OnsToast);
export const Card = addChildrenProp(OnsCard);
export const Toolbar = addChildrenProp(OnsToolBar);
export const AlertDialog = addChildrenProp(OnsAlertDialog);
export const AlertDialogButton = addChildrenProp(OnsAlertDialogButton);
export const Row = addChildrenProp(OnsRow);
export const Col = addChildrenProp(OnsCol);
export {default as CountSelector} from "./CountSelector";
export {default as ErrorDisplay} from "./ErrorDisplay";
export {default as PollIdDisplay} from "./PollIdDisplay";
export {default as ConfirmationDialog} from "./ConfirmationDialog";
export {default as RankedNomination} from "./RankedNomination";
export {default as ResultCard} from "./ResultCard";
export {default as Title} from "./Title";
