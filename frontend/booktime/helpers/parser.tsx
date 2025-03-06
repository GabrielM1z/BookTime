import { Buffer } from "buffer";

export const safeActionDecode = <T = unknown>(base64String: string): T | null => {
    try {
        let decoded: string | T = Buffer.from(base64String, "base64").toString();

        while (typeof decoded === "string") {
            try {
                decoded = JSON.parse(decoded);
            } catch {
                break;
            }
        }

        return decoded as T;
    } catch (error) {
        console.error("Invalid JSON or Base64 format:", error);
        return null;
    }
}

export const actionEncode = (data: any): string => {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}
