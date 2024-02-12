import { Page, ProgressCircular } from "react-onsenui";

export default function Loader() {
    return (
        <Page>
            <div className="flex flex-col items-center justify-center h-full">
                <ProgressCircular indeterminate />
            </div>
        </Page>
    )
}