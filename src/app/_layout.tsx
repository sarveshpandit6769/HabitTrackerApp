import { Stack } from "expo-router";
import { vexo } from 'vexo-analytics';

// Initialize Vexo at the root level, outside of any component
// Recommended to wrap in production-only check
if (__DEV__ === false) {
  vexo('8a66d63f-2b8b-47f8-b9ce-1ffb38fdb644');
}

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
