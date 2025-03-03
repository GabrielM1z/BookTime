import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";
import React from "react";

type UseRepositoryReturn<T> = {
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
    error: unknown;
    loading: boolean;
    refresh: () => Promise<void>;
};

/**
 * Custom React hook for handling asynchronous data fetching with state management.
 * 
 * @template T The expected return type of the asynchronous function.
 * @param func A function that returns a Promise resolving to data of type `T`.
 * @param defaultValue (Optional) The default value for `data` before the async function resolves.
 * @param deps (Optional) Dependency list to control when `fetchData` is regenerated.
 * @returns An object containing:
 *  - `data`: The fetched data or the default value.
 *  - `setData`: A function to manually update the `data` state.
 *  - `error`: Any error caught during the fetch process.
 *  - `loading`: A boolean indicating whether the request is in progress.
 *  - `refresh`: A function to manually trigger a data refresh.
 * 
 * @example
 * // Basic usage with automatic type inference
 * const { data, loading, error, refresh } = useRepository(
 *     () => fetchUserData(),
 *     { name: '', age: 0 }
 * );
 * 
 * @example
 * // Explicitly defining the type
 * const { data } = useRepository<User[]>(fetchUsers, []);
 */
export const useRepository = <T,>(
    func: () => Promise<T>,
    defaultValue?: T,
    deps: React.DependencyList = []
): UseRepositoryReturn<T> => {
    const [data, setData] = useState<T>(defaultValue as T);
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
