import { ApiError } from "./types";

function isApiError(obj: any): obj is ApiError {
    return obj && typeof obj === 'object' && 'data' in obj;
}

export default function getErrorMessage(e: unknown) {
    if(isApiError(e)) {
        return e.data.message;
    } else {
        return "Unknown Error Occurred"
    }
}