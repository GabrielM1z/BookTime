import { guestUserId } from '@/constants';
import { useAuthContext } from '@/contexts/AuthContext';
import commonStyles from '@/styles/commonStyles';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AxiosError } from 'axios';
import { Href, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "./SignIn.style";
import { Button, IconButton, Avatar, TextInput } from "react-native-paper";
import { PressableText, PasswordTextInput, TextSwitch } from "@/common";
import { AccountCenter } from '@/components/AccountCenter';

export default function SignIn() {
    const { showSessions = false } = useLocalSearchParams();
    const { logIn, logAsGuest, isLoading, sessions } = useAuthContext();
    const router = useRouter();

    const accountCenterRef = useRef<BottomSheetModal>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showLoggedUsers, setShowLoggedUsers] = useState(false);

    const handleLogIn = useCallback(async () => {
        Keyboard.dismiss();

        try {
            await logIn(email, password, rememberMe)
            router.replace('/(app)' as Href);
        }
        catch (error) {
            const axiosError = error as AxiosError;
            Alert.alert('Error', axiosError.message);
        }
    }, [email, password, rememberMe]);

    const handleLogAsGuest = useCallback(async () => {
        Keyboard.dismiss();
        try {
            await logAsGuest();
            router.replace('/(app)' as Href);
        }
        catch (error) {
            const axiosError = error as AxiosError;
            Alert.alert('Error', axiosError.message);
        }
    }, []);

    useEffect(() => {
        if (showSessions) {
            accountCenterRef.current?.present();
        }
    }, [showSessions])

    useEffect(() => {
        setShowLoggedUsers(sessions.filter((user) => user.id_user !== guestUserId).length > 0);
    }, [sessions]);

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <View style={commonStyles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#25a9e2" />
                </View>
            )}
            <View style={styles.innerContainer}>
                <View style={styles.headerContainer}>
                    <Avatar.Image size={150} source={require('@/assets/images/logo_refait.png')} />
                </View>
                <View style={styles.bodyContainer}>
                    <TextInput
                        placeholder="Email"
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <PasswordTextInput onChangeText={setPassword} />
                    <TextSwitch value={rememberMe} onValueChange={setRememberMe}>Se souvenir de moi </TextSwitch>
                </View>
                <View style={styles.bodyContainer}>
                    <Button mode="contained" onPress={handleLogIn} disabled={isLoading || !email || !password}>
                        Login
                    </Button>
                    <Button mode="contained" onPress={handleLogAsGuest} disabled={isLoading}>
                        Log as guest
                    </Button>
                    <PressableText
                        onPress={() => router.push('/ForgotPassword' as Href)}
                    >
                        Forgot Password
                    </PressableText>
                    <PressableText onPress={() => router.push('/SignUp' as Href)}>Sign Up</PressableText>
                    {
                        showLoggedUsers && (
                            <PressableText
                                onPress={() => accountCenterRef.current?.present()}
                            >
                                Logged users
                            </PressableText>
                        )
                    }
                    <AccountCenter
                        ref={accountCenterRef}
                        filter={(user) => user.id_user !== guestUserId}
                    />
                </View>
            </View>
            <View style={styles.footerContainer}>
                <IconButton icon="google" size={24} mode="contained" />
                <IconButton icon="facebook" size={24} mode="contained" />
                <IconButton icon="apple" size={24} mode="contained" />
            </View>
        </SafeAreaView>
    );
}
