import { JWTPayloadWithName } from "../app/slices/authSlice";

export function isJwtPayload(payload: any): payload is JWTPayloadWithName {
    return payload && typeof payload === "object" && "exp" in payload && "id" in payload;
}