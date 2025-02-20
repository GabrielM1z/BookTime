import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/contexts/AuthContext";
import { ActivityIndicator, StatusBar, View, Image } from "react-native";
import commonStyles from "@/styles/commonStyles";
import  styles  from "./SignUp.style";
import { TextInput, Button, Text } from "react-native-paper";


export default function Register() {
    const { isLoading, register } = useAuthContext();

    const logoImageSource = require('@/assets/images/logo_refait.png');
    
    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" />
            {isLoading && (
                <View style={commonStyles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#25a9e2" />
                </View>
            )}
            <Image
                resizeMode="contain"
                source={logoImageSource}
                // style={styles.logoImageStyle}
            />
            <View style={styles.textInputContainer}>
                <TextInput
                    label="Username"
                    mode="outlined"
                    // style={styles.textInput}
                />
                <TextInput
                    label="Email"
                    mode="outlined"
                    // style={styles.textInput}
                />
                <TextInput
                    label="Password"
                    mode="outlined"
                    // style={styles.textInput}
                />
                <TextInput
                    label="First Name"
                    mode="outlined"
                    // style={styles.textInput}
                />
                <TextInput
                    label="Last Name"
                    mode="outlined"
                    // style={styles.textInput}
                />
                <Button
                    mode="contained"
                    // onPress={() => register()}
                    // style={styles.button}
                >
                    Register
                </Button>
                
            </View>
            
        </SafeAreaView>
    )
}
