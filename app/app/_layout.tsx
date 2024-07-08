import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Habit Tracker'
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
