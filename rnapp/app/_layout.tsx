import { Stack } from "expo-router";
import { View } from "react-native";
import { Provider as PaperProvider, Text, MD3LightTheme, MD3DarkTheme, IconButton } from 'react-native-paper';
// @ts-ignore
import { useRouter } from 'expo-router';

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
          headerTitle: () => <Text variant='titleLarge' onPress={() => router.dismissTo('/')}>Habit Tracker</Text>,
          headerRight: () => (user ? <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
            <IconButton icon={theme === 'light' ? 'weather-night' : 'weather-sunny'} style={{ margin: 0 }} accessibilityLabel="toggle dark/light mode" onPress={toggleTheme} />
            <IconButton icon='logout' style={{ margin: 0 }} onPress={userService.signOut} accessibilityLabel="logout" />
          </View> : null),
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="create" options={{ title: 'Add' }} />
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
