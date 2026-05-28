import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Habit Tracker" }}
      />

      <Stack.Screen
        name="addHabit"
        options={{ title: "Add Habit" }}
      />

      <Stack.Screen
        name="history"
        options={{ title: "History" }}
      />
    </Stack>
  );
}