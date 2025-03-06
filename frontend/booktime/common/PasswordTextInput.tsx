import { TextInput, TextInputProps } from 'react-native-paper';
import React, { useState } from "react";

export interface PasswordTextInputProps extends TextInputProps {
    variant?: 'confirm' | 'password';
}

export const PasswordTextInput = ({
    variant = 'password',
    ...props
}: PasswordTextInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const placeholder = variant === 'password' ? 'Password' : 'Confirm Password';

    return (
        <TextInput
            placeholder={placeholder}
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
