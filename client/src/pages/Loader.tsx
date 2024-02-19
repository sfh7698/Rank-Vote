import { Page, ProgressCircular } from "react-onsenui";

export default function Loader() {
    return (
        <Page className="opacity-25">
            <div className="flex flex-col items-center justify-center h-full">
                <ProgressCircular indeterminate />
            </div>
        </Page>
    )
}