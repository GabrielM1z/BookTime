import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";


export function usePersistentState<T>(
    id: string,
    initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(initialValue);

    useEffect(() => {
        // Charger la valeur initiale depuis AsyncStorage
        const loadState = async () => {
            try {
                const storedValue = await AsyncStorage.getItem(id);
                if (storedValue !== null) {
                    setState(JSON.parse(storedValue));
                }
            } catch (error) {
                console.error(`Error loading state for ID ${id}:`, error);
            }
        };

        loadState();
    }, [id]);

    useEffect(() => {
        // Enregistrer les modifications de l'état dans AsyncStorage
        const saveState = async () => {
            try {
                await AsyncStorage.setItem(id, JSON.stringify(state));
            } catch (error) {
                console.error(`Error saving state for ID ${id}:`, error);
            }
        };

        saveState();
    }, [id, state]);

    return [state, setState];
}
