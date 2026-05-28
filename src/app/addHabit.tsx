import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STORAGE_KEY = "habits";

export default function AddHabitScreen() {
  const [habitName, setHabitName] = useState("");
  const router = useRouter();

  const addHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    try {
      const savedHabits = await AsyncStorage.getItem(STORAGE_KEY);

      const habits = savedHabits ? JSON.parse(savedHabits) : [];

      const newHabit = {
        id: Date.now().toString(),
        name: habitName,
        completedDates: [],
      };

      const updatedHabits = [...habits, newHabit];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedHabits)
      );

      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save habit");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Habit Name</Text>

      <TextInput
        placeholder="Enter habit name"
        value={habitName}
        onChangeText={setHabitName}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={addHabit}>
        <Text style={styles.buttonText}>Save Habit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});