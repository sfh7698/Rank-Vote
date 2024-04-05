import ons from "onsenui";
import { Toolbar } from ".";
import { BackButton } from "react-onsenui";

interface TitleProps {
    title: string
}

export default function Title({title}: TitleProps) {
    return (
        <Toolbar modifier="transparent">
            <div className="left">
                <BackButton></BackButton>
            </div>
            <div className="center">
                {ons.platform.isIOS() ? 
                    <h3>{title}</h3>
                :
                    <h3 className="pl-14">{title}</h3>
                }
            </div>
        </Toolbar>
    )
}