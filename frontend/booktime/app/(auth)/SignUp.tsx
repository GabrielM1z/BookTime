import { useAuthContext } from "@/contexts/AuthContext";
import commonStyles from "@/styles/commonStyles";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./SignUp.style";
import { PasswordTextInput } from "@/common";
import BackButton from "@/components/BackButton";
import { logo } from "@/assets/images";
import { Href, useRouter } from "expo-router";
import { useBookContext } from "@/contexts/BookContext";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const { isLoading, register, logIn } = useAuthContext();

    const handleRegister = async () => {
        try {
            await register(email, password, username);
            await logIn(email, password, true);
            router.replace('/(app)' as Href);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setPasswordError(!!password && !!confirmPassword && password !== confirmPassword)
    }, [password, confirmPassword])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backButtonContainer}>
                <BackButton />
            </View>
            {isLoading && (
                <View style={commonStyles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#25a9e2" />
                </View>
            )}
            <View style={styles.innerContainer}>
                <View style={styles.headerContainer}>
                    <Avatar.Image size={150} source={logo} />
                    <Text variant="titleLarge">Sign up</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <TextInput
                        placeholder="Email"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        error={emailError ? true : false}
                        label={emailError}
                        textContentType="emailAddress"
                    />
                    <PasswordTextInput onChangeText={setPassword} />
                    <PasswordTextInput variant="confirm" onChangeText={setConfirmPassword} error={passwordError} />
                    <TextInput
                        placeholder="Username"
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>
            </View>
            <View style={styles.footerContainer}>
                <Button
                    mode="contained"
                    onPress={handleRegister}
                    disabled={isLoading || !email || !password || !username || passwordError}
                >
                    Register
                </Button>
            </View>
        </SafeAreaView>
    )
}
