import { ImageSourcePropType, StyleSheet } from "react-native"
import { SharedValue } from "react-native-reanimated";

export interface BackgroundProps {
    scrollValue: SharedValue<number>;
    
    banner: ImageSourcePropType;
};

export const Background = ({
    scrollValue,
    banner,
}: BackgroundProps) => {
    return (

    );
};

const styles = StyleSheet.create({

})