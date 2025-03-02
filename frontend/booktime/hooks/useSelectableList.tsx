import { useState, useCallback, useEffect } from "react";

/**
 * A custom hook for managing a selectable list with single or multi-selection modes.
 * Selection is based on a unique key from the object rather than object reference.
 *
 * @param data - The list of items to select from.
 * @param defaultSelected - The initial selected items.
 * @param id - The key used to identify and compare items.
 * @param multiMode - If true, allows multiple selections; otherwise, only one item can be selected.
 * @param deps - Dependencies that trigger a reset of selected items.
 * @returns An object with selected items, a function to toggle selection, a function to check selection status and a function to get unselected items.
 */
export function useSelectableList<T>(
    data: T[],
    defaultSelected: T[] = [],
    id: keyof T,
    multiMode: boolean = false,
    deps: React.DependencyList = []
) {
    const [selectedItems, setSelectedItems] = useState<T[]>(defaultSelected);

    useEffect(() => {
        setSelectedItems(defaultSelected);
    }, deps);

    const toggleSelection = useCallback((item: T) => {
        setSelectedItems((prevSelected) => {
            const isAlreadySelected = prevSelected.some((i) => i[id] === item[id]);

            if (multiMode) {
                return isAlreadySelected
                    ? prevSelected.filter((i) => i[id] !== item[id])
                    : [...prevSelected, item];
            } else {
                return isAlreadySelected ? [] : [item];
            }
        });
    }, [multiMode, id]);

    const isSelected = useCallback(
        (item: T) => selectedItems.some((i) => i[id] === item[id]),
        [selectedItems, id]
    );

    const unselectedItems = useCallback(() => data.filter((item) => !isSelected(item)), [data, isSelected]);

    return { selectedItems, toggleSelection, isSelected, unselectedItems };
}
