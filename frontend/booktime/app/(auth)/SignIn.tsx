import { AccountCenter } from '@/components/bottomSheets/AccountCenter';
import { guestUserId } from '@/constants';
import { useAuthContext } from '@/contexts/AuthContext';
import commonStyles from '@/styles/commonStyles';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AxiosError } from 'axios';
import { Href, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Keyboard, StatusBar, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "./SignIn.style";


export default function SignIn() {
    const { showSessions = false } = useLocalSearchParams();
    const { logIn, logAsGuest, isLoading, sessions } = useAuthContext();
    const router = useRouter();
    
    const accountCenterRef = useRef<BottomSheetModal>(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const logoImageSource = require('@/assets/images/logo_refait.png');

    const handleLogIn = useCallback(async () => {
        Keyboard.dismiss();

        try {
            await logIn(username, password, rememberMe)
            router.replace('/(app)' as Href<'(app)'>);
        }
        catch (error) {
            const axiosError = error as AxiosError;
            Alert.alert('Error', axiosError.message);
        }
    }, [logIn, router, username, password, rememberMe]);

    const handleLogAsGuest = useCallback(async () => {
        Keyboard.dismiss();
        await logAsGuest();
        router.replace('/(app)' as Href<'(app)'>);
    }, [logAsGuest, router]);

    useEffect(() => {
        if (showSessions && sessions.length > 0) {
            accountCenterRef.current?.present();
        }
    }, [showSessions])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {isLoading && (
                <View style={commonStyles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#25a9e2" />
                </View>
            )}
            <Image
                resizeMode="contain"
                source={logoImageSource}
                style={styles.logoImageStyle}
            />
            <View style={styles.textInputContainer}>
                <View style={styles.usernameTextInputContainer}>
                    <TextInput
                        placeholder="Username"
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.passwordTextInputContainer}>
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={!isPasswordVisible}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        style={styles.textInput}
                    />
                    <TouchableOpacity
                        style={styles.eyeIconContainer}
                        onPress={() => setIsPasswordVisible((prev) => !prev)}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.switchContainer}>
                    <Switch value={rememberMe} onValueChange={setRememberMe} />
                    <Text style={styles.switchText}>Se souvenir de moi</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.loginButtonStyle,
                        (isLoading || !username || !password) && styles.disabledButtonStyle,
                    ]}
                    disabled={isLoading || !username || !password}
                    onPress={handleLogIn}
                >
                    <Text style={styles.loginTextStyle}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.loginButtonStyle}
                    disabled={isLoading}
                    onPress={handleLogAsGuest}
                >
                    <Text style={styles.loginTextStyle}>Log as guest</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.signupStyle}
                    onPress={() => router.push('/SignUp' as Href<'SignUp'>)}
                >
                    <Text style={styles.signupTextStyle}>Créer un compte</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.forgotPasswordStyle}
                    onPress={() => router.push('/ForgotPassword' as Href<'ForgotPassword'>)}
                >
                    <Text style={styles.forgotPasswordTextStyle}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
                {sessions.length > 0 && <TouchableOpacity // FIXME: filter guest or refactor AccountCenter
                    style={styles.logAsStyle}
                    onPress={() => accountCenterRef.current?.present()}
                >
                    <Text style={styles.logAsTextStyle}>Log As</Text>
                </TouchableOpacity>}
            </View>
            <View style={styles.socialLoginContainer}>
                <TouchableOpacity style={styles.socialBubble}>
                    <AntDesign name="google" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialBubble, styles.facebookBubble]}>
                    <AntDesign name="facebook-square" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialBubble, styles.twitterBubble]}>
                    <AntDesign name="twitter" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <AccountCenter
                ref={accountCenterRef}
                filter={(user) => user.id_user !== guestUserId}
                // header={<Text>Continuer en tant que</Text>}
            />
        </SafeAreaView>
    );
}
