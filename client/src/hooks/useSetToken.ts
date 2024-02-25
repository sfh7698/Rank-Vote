import { useAppDispatch } from "./useAppDispatch";
import { setToken } from "../app/slices/authSlice";
import { useEffect } from "react";

export function useSetToken(){
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if(token) {
            dispatch(setToken(token));
        }
    }, []);
}