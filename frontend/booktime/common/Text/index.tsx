import { Text as TextComponent } from "react-native-paper";
import PressableText from "./PressableText";

const Text = TextComponent as typeof TextComponent & {
    Pressable: typeof PressableText;
};
Text.Pressable = PressableText;

export default Text;
