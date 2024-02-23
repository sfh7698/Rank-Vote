import { useEffect, useState } from "react";
import { homeRoute } from "../utils";
import { Navigator } from "react-onsenui";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectError } from "../app/slices/errorSlice";


export function useCheckConnection(navigator: Navigator | undefined) {
    const [isConnected, setIsConnected] = useState(true);

    const error = useAppSelector(selectError);

    useEffect(() => {
        if (error === "Failed to connect to poll") {
            setIsConnected(false);
            navigator?.resetPage(homeRoute);
        }

    }, [error]);

    return isConnected;
}
