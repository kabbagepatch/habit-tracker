import { Stack } from "expo-router";
import { View } from "react-native";
import { Provider as PaperProvider, Text, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
// @ts-ignore
import { useRouter } from 'expo-router';

import { Button } from "react-native-paper";
import { userService } from "../service";
import useUserInfo from "../hooks/useUserInfo";
import { HabitsProvider } from "@/hooks/HabitContext";
import { ThemeProvider } from '@/hooks/ThemeContext';
import { useTheme } from "@/hooks/useTheme";

function MyStack() {
  const { user } = useUserInfo();
  const router = useRouter();
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <PaperProvider theme={theme === 'light' ? MD3LightTheme : MD3DarkTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.header,
            borderBottomColor: colors.header,
          },
          headerTintColor: colors.text,
          headerTitle: () => <Text variant='headlineSmall' onPress={() => router.dismissTo('/')}>75 Hotter</Text>,
          headerRight: () => (user ? <View style={{ justifyContent: 'flex-end', marginRight: 10, flexDirection: 'row' }}>
            <Button
              uppercase
              mode='text'
              onPress={toggleTheme}
              labelStyle={{ fontFamily: ' -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif' }}
              style={{ marginRight: 10 }}
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </Button>
            <Button
              uppercase
              mode='contained'
              onPress={userService.signOut}
              labelStyle={{ fontFamily: ' -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif' }}
              buttonColor="hsla(0, 100%, 71%, 1)"
            >
              Sign Out
            </Button>
          </View> : null),
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="create" />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <HabitsProvider>
        <MyStack />
      </HabitsProvider>
    </ThemeProvider>
  );
}
