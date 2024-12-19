import React, { forwardRef, useCallback, useState, useEffect } from "react";
import { StyleSheet, Dimensions, BackHandler } from "react-native";
import { BottomSheetModal, BottomSheetModalProps, useBottomSheetModal } from "@gorhom/bottom-sheet";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_HEIGHT = SCREEN_HEIGHT / 2;

export type CustomBottomSheetProps = BottomSheetModalProps

export const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>((props, ref) => {
    const { onAnimate, ...restProps } = props;

    const { dismiss } = useBottomSheetModal();
    const [isOpen, setIsOpen] = useState(false);

    const handleAnimated = useCallback((fromIndex: number, toIndex: number) => {
        setIsOpen(toIndex !== -1);
        onAnimate && onAnimate(fromIndex, toIndex);
    }, []);

    const handleBackPress = useCallback(() => {
        console.log('isOpen', isOpen);
        if (isOpen) {
            dismiss();
            return true;
        }
        return false;
    }, [isOpen, dismiss]);
    
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, [handleBackPress]);
    
    return (
        <BottomSheetModal ref={ref}
            index={0}
            bottomInset={8}
            detached
            style={styles.sheetContainer}
            // stackBehavior='switch'
            maxDynamicContentSize={MAX_HEIGHT}
            onAnimate={handleAnimated}
            {...restProps} />
    );
});

const styles = StyleSheet.create({
    sheetContainer: {
        marginHorizontal: 4,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
});
