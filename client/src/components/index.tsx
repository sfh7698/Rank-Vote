import React from "react";
import { 
    Button as OnsButton,
    Fab as OnsFab,
    Toast as OnsToast
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
export {default as CountSelector} from "./CountSelector";
export {default as ErrorDisplay} from "./ErrorDisplay";
export {default as PollIdDisplay} from "./PollIdDisplay";