import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Habit = {
  id: string;
  name: string;
  completedDates: string[];
};

const STORAGE_KEY = "habits";

function getLast7Days() {
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }

  return days;
}

export default function HistoryScreen() {
  const { habitId } = useLocalSearchParams();
  const [habit, setHabit] = useState<Habit | null>(null);

  useEffect(() => {
    loadHabit();
  }, []);

  const loadHabit = async () => {
    const savedHabits = await AsyncStorage.getItem(STORAGE_KEY);
    const habits: Habit[] = savedHabits ? JSON.parse(savedHabits) : [];

    const selectedHabit = habits.find((item) => item.id === habitId);
    setHabit(selectedHabit || null);
  };

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text>Habit not found.</Text>
      </View>
    );
  }

  const last7Days = getLast7Days();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{habit.name}</Text>
      <Text style={styles.subHeading}>Last 7 Days History</Text>

      {last7Days.map((date) => {
        const isDone = habit.completedDates.includes(date);

        return (
          <View key={date} style={styles.row}>
            <Text style={styles.date}>{date}</Text>
            <Text style={isDone ? styles.done : styles.missed}>
              {isDone ? "✅ Done" : "❌ Missed"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6F7FB",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
  },
  subHeading: {
    marginTop: 8,
    marginBottom: 20,
    color: "#666",
    fontSize: 16,
  },
  row: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
  },
  done: {
    color: "#16A34A",
    fontWeight: "700",
  },
  missed: {
    color: "#DC2626",
    fontWeight: "700",
  },
});