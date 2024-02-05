import { Button as OnsButton } from "react-onsenui";
import React from "react";

interface ButtonWithChildren extends React.ComponentProps<typeof OnsButton> {
    children?: React.ReactNode
}

export const Button: React.FC<ButtonWithChildren> = (props) => {
    return <OnsButton {...props}>{props.children}</OnsButton>
}