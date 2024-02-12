import { Navigator } from "react-onsenui"
import { Route } from "./types"

const goToPage = (navigator: Navigator | undefined, key: string, component: Route["component"]) => {

    const route: Route = {
        props: {
            key,
            navigator
        },
        component
    }

        navigator?.pushPage(route)
}

export default goToPage;