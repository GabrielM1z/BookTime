import { TextInput, TextInputProps } from 'react-native-paper';
import React, { useState } from "react";

export interface PasswordTextInputProps extends TextInputProps { }

export const PasswordTextInput = (props: PasswordTextInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
        <TextInput
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            right={
                <TextInput.Icon
                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setIsPasswordVisible((prev) => !prev)} />
            }
            {...props}
        />
    );
}
