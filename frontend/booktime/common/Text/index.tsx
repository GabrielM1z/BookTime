import { Text as TextComponent } from "react-native-paper";
import PressableText from "./PressableText";
import { withAnimated } from "../withAnimation";

const Animated = withAnimated(TextComponent);
const Text = TextComponent as typeof TextComponent & {
    Pressable: typeof PressableText;
    Animated: typeof Animated;
};
Text.Pressable = PressableText;
Text.Animated = Animated;

export default Text;
