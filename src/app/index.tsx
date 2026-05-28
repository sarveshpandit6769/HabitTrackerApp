import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Habit = {
  id: string;
  name: string;
  completedDates: string[];
};

const STORAGE_KEY = "habits";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getStreak(completedDates: string[]) {
  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateString = currentDate.toISOString().split("T")[0];

    if (completedDates.includes(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export default function HomeScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);

  const loadHabits = async () => {
    const savedHabits = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const saveHabits = async (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHabits));
  };

  const toggleToday = async (habitId: string) => {
    const today = getTodayDate();

    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const alreadyDone = habit.completedDates.includes(today);

        return {
          ...habit,
          completedDates: alreadyDone
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today],
        };
      }

      return habit;
    });

    saveHabits(updatedHabits);
  };

  const deleteHabit = (habitId: string) => {
  const updatedHabits = habits.filter((habit) => habit.id !== habitId);
  saveHabits(updatedHabits);
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Today&apos;s Habits</Text>

      <Pressable style={styles.addButton} onPress={() => router.push("/addHabit")}>
        <Text style={styles.addButtonText}>+ Add New Habit</Text>
      </Pressable>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No habits yet. Add your first habit.</Text>
        }
        renderItem={({ item }) => {
          const today = getTodayDate();
          const isDoneToday = item.completedDates.includes(today);
          const streak = getStreak(item.completedDates);

          return (
            <View style={styles.card}>
              <View>
                <Text style={styles.habitName}>{item.name}</Text>
                <Text style={styles.streakText}>🔥 Current streak: {streak} day(s)</Text>
              </View>

              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.doneButton, isDoneToday && styles.doneActive]}
                  onPress={() => toggleToday(item.id)}
                >
                  <Text style={styles.doneText}>{isDoneToday ? "Done" : "Mark Done"}</Text>
                </Pressable>

                <Pressable
                  style={styles.historyButton}
                  onPress={() =>
                    router.push({
                      pathname: "/history",
                      params: { habitId: item.id },
                    })
                  }
                >
                  <Text style={styles.historyText}>History</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => deleteHabit(item.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#000000",
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    color: "#777",
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  habitName: {
    fontSize: 20,
    fontWeight: "700",
  },
  streakText: {
    marginTop: 6,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    flexWrap: "wrap",
  },
  doneButton: {
    backgroundColor: "#999",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  doneActive: {
    backgroundColor: "#16A34A",
  },
  doneText: {
    color: "white",
    fontWeight: "700",
  },
  historyButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  historyText: {
    color: "white",
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "700",
  },
});