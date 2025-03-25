import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Provider as PaperProvider, Text, MD3LightTheme } from 'react-native-paper';
import { signOut, onAuthStateChanged } from 'firebase/auth';

import { firebaseAuth } from "./firebaseApp";
import { Button } from "react-native-paper";
let auth = firebaseAuth;

export default function RootLayout() {
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || '');
    });

    return () => unsubscribe();
  }, []);

  const onSignOut = async () => {
    await signOut(auth);
  };

  return (
    <PaperProvider theme={MD3LightTheme}>
      <Stack
        screenOptions={{
          headerTitle: () => <Text variant='headlineSmall'>Habit Tracker</Text>,
          headerRight: () => (userEmail ? <View style={{ justifyContent: 'flex-end' }}>
            <Button uppercase compact mode='contained' onPress={onSignOut} labelStyle={{ fontFamily: ' -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif' }}>
              Sign Out
            </Button>
          </View> : null),
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="create" />
      </Stack>
    </PaperProvider>
  );
}
