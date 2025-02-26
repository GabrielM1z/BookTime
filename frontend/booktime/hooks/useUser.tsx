import { useAuthContext } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { User } from "@/models/User";
import { useState, useEffect } from "react";


export const useUser = () => {
    const userController = useUserContext();
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
