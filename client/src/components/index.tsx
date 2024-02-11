import React from "react";
import { 
    Button as OnsButton,
    Fab as OnsFab
     } from "react-onsenui";

function addChildrenProp<T extends React.ComponentType>(component: T) {

    const WithChildren: React.ComponentType<React.ComponentProps<T> & { children?: React.ReactNode }> = (props) => {
        return React.createElement(component, props);
    };

    return WithChildren;
}

export const Button = addChildrenProp(OnsButton);
export const Fab = addChildrenProp(OnsFab);
export {default as CountSelector} from "./CountSelector";