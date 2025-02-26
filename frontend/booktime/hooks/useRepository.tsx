import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";

/**
 * 
 * @param {T} func - La fonction à exécuter.
 * @param {Awaited<ReturnType<T>>} defaultValue - La valeur par défaut de la réponse.
 * @param {React.DependencyList} deps - Liste des dépendances pour recharger la requête.
 * @returns {object} Un objet contenant :
 * - {Awaited<ReturnType<T>>} data : La donnée retournée par la requête.
 * - {boolean} loading : Indique si la requête est en cours d'exécution.
 * - {unknown} error : Contient l'erreur en cas d'échec de la requête.
 * - {() => void} refresh : Fonction permettant de réexécuter la requête manuellement.
 */
export const useRepository = <T extends () => Promise<any>>(
    func: T,
    defaultValue: Awaited<ReturnType<T>> = null as any,
    deps: React.DependencyList = []
) => {
    type R = Awaited<ReturnType<T>>;

    const [data, setData] = useState<R>(defaultValue);
    const [error, setError] = useState<unknown>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await func();
            setData(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, setData, error, loading, refresh: fetchData };
};
