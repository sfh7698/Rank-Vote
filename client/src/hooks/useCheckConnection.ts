import { useEffect, useState } from "react";
import { homeRoute } from "../utils";
import { Navigator } from "react-onsenui";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectError } from "../app/slices/errorSlice";
import { setToken } from "../app/slices/authSlice";
import { useAppDispatch } from "./useAppDispatch";

export function useCheckConnection(navigator: Navigator | undefined) {
    const [isConnected, setIsConnected] = useState(true);
    const dispatch = useAppDispatch();

    const error = useAppSelector(selectError);

    useEffect(() => {
        if (error === "Failed to connect to poll") {
            setIsConnected(false);
            localStorage.removeItem("accessToken");
            dispatch(setToken(null));
            navigator?.resetPage(homeRoute);
        }

    }, [error]);

    return isConnected;
}
