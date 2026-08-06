import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "sallar_session";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        setLoggedIn(session === "true");
      } catch (e) {
        setLoggedIn(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const signIn = async () => {
    await AsyncStorage.setItem(SESSION_KEY, "true");
    setLoggedIn(true);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  };

  return (
    <SessionContext.Provider value={{ loggedIn, ready, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
