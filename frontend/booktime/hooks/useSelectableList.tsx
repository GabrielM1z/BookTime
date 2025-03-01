import { useState, useCallback } from "react";

export function useSelectableList<T>(
    data: T[],
    defaultSelected: T[] = [],
    multiMode: boolean = false
) {
    const [selectedItems, setSelectedItems] = useState<T[]>(defaultSelected);

    const toggleSelection = useCallback((item: T) => {
        setSelectedItems((prevSelected) => {
            const isAlreadySelected = prevSelected.includes(item);

            if (multiMode) {
                return isAlreadySelected
                    ? prevSelected.filter((i) => i !== item)
                    : [...prevSelected, item];
            } else {
                return isAlreadySelected ? [] : [item];
            }
        });
    }, [multiMode]);

    const isSelected = useCallback((item: T) => selectedItems.includes(item), [selectedItems]);

    return { selectedItems, toggleSelection, isSelected };
}
