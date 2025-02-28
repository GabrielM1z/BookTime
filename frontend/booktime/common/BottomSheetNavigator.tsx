import { 
    BottomSheetNavigationEventMap, 
    BottomSheetNavigationOptions, 
    createBottomSheetNavigator 
} from "@th3rdwave/react-navigation-bottom-sheet";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";

const { Navigator } = createBottomSheetNavigator();

export const BottomSheetNavigator = withLayoutContext<
    BottomSheetNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    BottomSheetNavigationEventMap
>(Navigator);
