import React, { useState } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import { useSession } from '@/context/auth';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

export default function SignIn() {
    const { logIn, logAsGuest } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogIn = async () => {
        setIsLoading(true);

        try {
            await logIn(username, password, rememberMe)
            router.replace('(app)');
        }
        catch (error) {
            Alert.alert('Error', error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleLogAsGuest = async () => {
        console.log('Starting guest session');
        await logAsGuest();
        console.log('Guest session started');
        router.replace('(app)');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
            />

            <View style={styles.switchContainer}>
                <Switch value={rememberMe} onValueChange={setRememberMe} />
                <Text style={styles.switchText}>Se souvenir de moi</Text>
            </View>

            <Button
                title={isLoading ? 'Loading...' : 'Login'}
                onPress={handleLogIn}
                disabled={isLoading || !username || !password}
            />

            <Button title="Enter as Guest" onPress={handleLogAsGuest} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchText: {
        marginLeft: 10,
    },
});
