import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({
  session: null as string | null,
  isGuest: false,
  isLoading: true,
  signIn: (token: string, remember: boolean) => {},
  signOut: () => {},
  enterAsGuest: () => {},
});

export function useSession() {
  return useContext(AuthContext);
}

import { ReactNode } from 'react';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la session à partir du stockage sécurisé au démarrage
  useEffect(() => {
    async function loadSession() {
      const storedSession = await SecureStore.getItemAsync('session');
      if (storedSession) {
        setSession(storedSession);
      }
      setIsLoading(false);
    }
    loadSession();
  }, []);

  const signIn = async (token: string, remember: boolean) => {
    setSession(token);
    setIsGuest(false);

    if (remember) {
      await SecureStore.setItemAsync('session', token);
    }
  };

  const signOut = async () => {
    setSession(null);
    setIsGuest(false);
    await SecureStore.deleteItemAsync('session');
  };

  const enterAsGuest = () => {
    setSession(null);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{ session, isGuest, isLoading, signIn, signOut, enterAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}
