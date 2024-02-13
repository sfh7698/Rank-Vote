import { ApiError } from "./types";

export function isApiError(obj: any): obj is ApiError {
    return obj && typeof obj === 'object' && 'data' in obj;
}