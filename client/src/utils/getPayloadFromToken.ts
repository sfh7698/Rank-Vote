import { JwtPayload, jwtDecode } from "jwt-decode";

export interface JWTPayloadWithName extends JwtPayload {
    name: string,
    subject: string
}

export function getPayloadFromToken(token: string) {
    const payload = jwtDecode<JWTPayloadWithName>(token);
    return {
        id: payload.subject,
        ...payload
    }

}