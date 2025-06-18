import { useEffect, useState } from 'react';
import { StatusBar, Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FAB, Checkbox, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Login from './components/login';
import { habitService } from '../service';
import useUserInfo from '../hooks/useUserInfo';

export default function Index() {
  const { replace } = useLocalSearchParams();
  const router = useRouter();
  const { loading : loadingUser, user } = useUserInfo();
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [userHabits, setUserHabits] = useState<Habit[]>([]);

  const setHabits = async () => {
    const habits = await habitService.getHabits();
    setLoadingHabits(true);
    if (habits) {
      setUserHabits(habits);
    }
  }

  const isCheckedToday = (habit : Habit, minus : number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - minus);
    const dateString = date.toLocaleDateString();
    const checkInInd = habit.checkIns.findIndex((checkIn : any) => checkIn.date == dateString);
    if (checkInInd === -1) {
      return false
    } else {
      return habit.checkIns[checkInInd].status;
    }
  }

  const onCheck = async (habitInd : number, minus : number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - minus);
    const dateString = date.toLocaleDateString();
    const habit = userHabits[habitInd];
    const updatedHabit = await habitService.checkIn(habit.id, dateString, !isCheckedToday(habit, minus));
    if (!updatedHabit) return;
    setUserHabits(userHabits.map((h, i) => i === habitInd ? { ...h, checkIns: updatedHabit.checkIns, currentStreak: updatedHabit.currentStreak } : h));
  }

  const onDelete = async (habitInd : number) => {
    const habit = userHabits[habitInd];
    await habitService.deleteHabit(habit.id);

    setUserHabits(userHabits.filter((_, i) => i !== habitInd));
  }

  useEffect(() => {
    if (user || replace) {
      setHabits();
      if (replace) {
        router.replace('/');
      }
    }
  }, [user, replace]);

  if (loadingUser) return <Text>Loading...</Text>

  if (!user) return <Login />;

  if (userHabits.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>No habits found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.habitsContainer}>
        <FlatList
          style={{ paddingBottom: 70 }}
          data={userHabits}
          keyExtractor={(item : any) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.habitContainer}>
              <View style={styles.habit}>
                <View style={styles.habitNameContainer}> 
                  <Text style={[styles.habitName, { color: (item.color || 'hsl(0, 0%, 60%)') }]}>
                    {item.name + ` (${item.currentStreak})`}
                  </Text>
                  <IconButton icon='delete' iconColor='hsla(0, 100%, 50%, 0.66)' onPress={() => onDelete(index)} />
                </View>
                <View style={styles.habitChecks}>
                  {
                    Array.from({ length: 5 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - i);
                      const checkedColor = item.color || 'hsl(0, 0%, 60%)';
                      const unCheckedColor = item.color ? item.color.replace(', 1)', ', 0.15)') :'hsla(0, 0%, 60%, 0.15)';
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => onCheck(index, i)}
                          style={[styles.habitCheck, { backgroundColor: isCheckedToday(item, i) ? checkedColor : unCheckedColor }]}
                        >
                          <Text key={i} style={styles.date}>{date.getDate()}</Text>
                        </TouchableOpacity>
                      );
                    })
                  }
                </View>
              </View>
            </View>
          )}
        />
        <FAB
          style={styles.createButton}
          icon='plus'
          onPress={() => router.navigate('/create')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitsContainer: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  date: {
    fontSize: 15,
    width: 36,
    textAlign: 'center',
  },
  habitContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: 'hsl(0, 0%, 0%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habit: {
    width: '100%',
  },
  habitNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitChecks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  habitCheck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'hsl(296, 100.00%, 87.30%)'
  }
});
