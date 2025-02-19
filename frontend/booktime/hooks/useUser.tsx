import { useController } from "./useController";
import { useAuthContext } from "./useAuth";
import { User } from "@/models/User";
import { useState, useEffect } from "react";


export const useUser = () => {
    const { userController } = useController();
    const { session } = useAuthContext();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            if (session) {
                const user = await userController.getBySession(session);
                setUser(user);
            }
        })();
    }, [session]);

    return user;
}
