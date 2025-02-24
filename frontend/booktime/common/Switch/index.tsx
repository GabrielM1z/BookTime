import { Switch as SwitchComponent } from "react-native-paper";
import { TextSwitch } from "./TextSwitch";
export type { TextSwitchProps } from "./TextSwitch";

const Switch = SwitchComponent as typeof SwitchComponent & {
    Text: typeof TextSwitch;
};
Switch.Text = TextSwitch;

export default Switch;
