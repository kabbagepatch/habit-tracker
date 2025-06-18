import { Stack } from "expo-router";
import { View } from "react-native";
import { Provider as PaperProvider, Text, MD3LightTheme } from 'react-native-paper';

import { Button } from "react-native-paper";
import { userService } from "../service";
import useUserInfo from "../hooks/useUserInfo";

export default function RootLayout() {
  const { user } = useUserInfo();

  return (
    <PaperProvider theme={MD3LightTheme}>
      <Stack
        screenOptions={{
          headerTitle: () => <Text variant='headlineSmall'>Habit Tracker</Text>,
          headerRight: () => (user ? <View style={{ justifyContent: 'flex-end', marginRight: 10 }}>
            <Button
              uppercase
              compact
              mode='contained'
              onPress={userService.signOut}
              labelStyle={{ fontFamily: ' -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif' }}
            >
              Sign Out
            </Button>
          </View> : null),
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="create" />
        <Stack.Screen name="cursor" />
      </Stack>
    </PaperProvider>
  );
}
