import { useAuthContext } from "@/contexts/AuthContext";
import commonStyles from "@/styles/commonStyles";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./SignUp.style";
import { PasswordTextInput } from "@/common";
import BackButton from "@/components/BackButton";


export default function Register() {
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    const { isLoading, register } = useAuthContext();

    const handleRegister = async () => {
        // try {
        //     await register({})
        // }
    }

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
                    <Avatar.Image size={150} source={require('@/assets/images/logo_refait.png')} />
                    <Text variant="titleLarge">Sign up</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <TextInput
                        placeholder="Email"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        error={emailError ? true : false}
                        label={emailError}

                    />
                    <PasswordTextInput onChangeText={setPassword} />
                    <TextInput
                        placeholder="Username"
                        onChangeText={setUsername}
                    />
                </View>
            </View>
            <View style={styles.footerContainer}>
                <Button
                    mode="contained"
                    onPress={() => { }}
                    disabled={isLoading || !email || !password || !username}
                >
                    Register
                </Button>
            </View>
        </SafeAreaView>
    )
}
