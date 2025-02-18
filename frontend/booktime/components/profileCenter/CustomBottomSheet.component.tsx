import React, { forwardRef, useCallback, useState, useEffect } from "react";
import { StyleSheet, Dimensions, BackHandler } from "react-native";
import { BottomSheetModal, BottomSheetModalProps, useBottomSheetModal, BottomSheetHandle } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_HEIGHT = SCREEN_HEIGHT / 2;

export type CustomBottomSheetProps = BottomSheetModalProps & {
    setIsOpen?: (isOpen: boolean) => void;
}

export const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>((props, ref) => {
    const { onAnimate, ...restProps } = props;

    const { dismiss } = useBottomSheetModal();
    const [isOpen, setIsOpen] = useState(false);

    const handleAnimated = useCallback((fromIndex: number, toIndex: number) => {
        setIsOpen(toIndex !== -1);
        props.setIsOpen && props.setIsOpen(toIndex !== -1);
        onAnimate && onAnimate(fromIndex, toIndex);
    }, []);

    const handleBackPress = useCallback(() => {
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
            bottomInset={8 + 15 + 35} // FIXME: 15 -> bottom inset, 35 -> footer height
            detached
            style={styles.sheetContainer}
            // stackBehavior='push'
            maxDynamicContentSize={MAX_HEIGHT}
            // enableDynamicSizing={false}
            onAnimate={handleAnimated}
            {...restProps}/>
    );
});

const styles = StyleSheet.create({
    sheetContainer: {
        marginHorizontal: 4,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
});
