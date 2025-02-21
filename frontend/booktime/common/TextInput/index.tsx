import { TextInput as TextInputComponent } from "react-native-paper";
import { PasswordTextInput } from "./PasswordTextInput";

const TextInput = TextInputComponent as typeof TextInputComponent & {
    Password: typeof PasswordTextInput;
};
TextInput.Password = PasswordTextInput;

export default TextInput;
