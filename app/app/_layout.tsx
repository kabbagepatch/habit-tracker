import { Stack } from "expo-router";
import { View } from "react-native";
import { Provider as PaperProvider, Text, MD3LightTheme } from 'react-native-paper';
// @ts-ignore
import { useRouter } from 'expo-router';

import { Button } from "react-native-paper";
import { userService } from "../service";
import useUserInfo from "../hooks/useUserInfo";
import { HabitsProvider } from "@/hooks/HabitContext";

export default function RootLayout() {
  const { user } = useUserInfo();
  const router = useRouter();

  return (
    <PaperProvider theme={MD3LightTheme}>
      <HabitsProvider>
        <Stack
          screenOptions={{
            headerTitle: () => <Text variant='headlineSmall' onPress={() => router.dismissTo('/')}>Habit Tracker</Text>,
            headerRight: () => (user ? <View style={{ justifyContent: 'flex-end', marginRight: 10 }}>
              <Button
                uppercase
                compact
                mode='contained'
                onPress={userService.signOut}
                labelStyle={{ fontFamily: ' -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif' }}
                buttonColor="hsla(0, 100%, 71%, 1)"
              >
                Sign Out
              </Button>
            </View> : null),
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="create" />
        </Stack>
      </HabitsProvider>
    </PaperProvider>
  );
}
