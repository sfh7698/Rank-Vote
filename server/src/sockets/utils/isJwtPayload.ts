import { JwtPayload } from "jsonwebtoken";

export function isJwtPayload(payload: any): payload is JwtPayload {
    return payload && typeof payload === "object" && "subject" in payload && "pollID" in payload && "name" in payload;
}