import { BottomSheetProps } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
//@ts-ignore
import { StackNavigationOptions } from "@react-navigation/stack";
import { CustomBottomSheet } from './BottomSheet';

export interface BottomSheetModalProps extends BottomSheetProps { }

export const BottomSheetModal = ({
    children,
    ...bottomSheetProps
}: BottomSheetModalProps) => {
    const router = useRouter();

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            router.back();
        }
    }, [router]);

    return (
        <CustomBottomSheet onChange={handleSheetChanges} {...bottomSheetProps}>
            {children}
        </CustomBottomSheet>
    );
};

export const BottomSheetModalScreenOptions: StackNavigationOptions = {
    headerShown: false,
    presentation: 'transparentModal',
    animation: 'none'
}
