import React, { useState } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import { useSession } from '@/context/auth';
import { keycloakAuthUrl, keycloakClientId } from '@/constants/Api';

export default function SignIn() {
  const { signIn, enterAsGuest } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    const body = new URLSearchParams({
      client_id: keycloakClientId,
      grant_type: 'password',
      username,
      password,
      scope: 'openid profile email',
    });

    try {
      const response = await fetch(keycloakAuthUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const { access_token } = data;

      signIn(access_token, rememberMe); // Sauvegarde le token si "Se souvenir de moi" est activé
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.switchContainer}>
        <Switch value={rememberMe} onValueChange={setRememberMe} />
        <Text style={styles.switchText}>Se souvenir de moi</Text>
      </View>

      <Button
        title={isLoading ? 'Loading...' : 'Login'}
        onPress={handleLogin}
        disabled={isLoading || !username || !password}
      />

      <Button title="Enter as Guest" onPress={enterAsGuest} />
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
