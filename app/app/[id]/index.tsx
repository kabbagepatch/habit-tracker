import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import { useLocalSearchParams } from 'expo-router';

import Login from '../components/login';
import Loading from '../components/loading';
import { habitService } from '@/service';
import useUserInfo from '@/hooks/useUserInfo';
import HabitCalendar from '../components/calendar';
import { HabitsContext } from '@/hooks/HabitContext';
import { useTheme } from '@/hooks/useTheme';

export default function ViewHabit() {
  const { loading, user } = useUserInfo();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loadingHabit, setLoadingHabit] = useState(true);
  const [habit, setHabit] = useState<Habit>();

  const { allHabits, updateHabit } = useContext(HabitsContext);
  const { colors } = useTheme();

  const retrieveHabit = async (id : string) => {
    if (allHabits && allHabits[id]) {
      setHabit(allHabits[id]);
      setLoadingHabit(false);
      return;
    }

    const retrievedHabit = await habitService.getHabit(id);
    if (retrievedHabit) {
      setHabit(retrievedHabit);
    }
    setLoadingHabit(false);
  }

  useEffect(() => {
    if (user) {
      retrieveHabit(id);
    }
  }, [user]);

  if (loading) return <Loading />
  if (!user) return <Login />;
  if (loadingHabit) return <Loading />
  if (!habit) return <Text>Habit not found</Text>

  const onCheck = async (date : Date, isChecked : boolean) => {
    const dateString = date.toLocaleDateString();
    const updatedHabit = await habitService.checkIn(id, dateString, !isChecked);
    if (!updatedHabit) return;
    setHabit({ ...habit, checkIns: updatedHabit.checkIns, currentStreak: updatedHabit.currentStreak });
    if (updateHabit) updateHabit(id, { ...habit, checkIns: updatedHabit.checkIns, currentStreak: updatedHabit.currentStreak });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: habit.color, backgroundColor: colors.cardHeader, textShadowColor: colors.textShadow }]}>{habit.name}</Text>
      <Text style={[styles.info, { color: habit.color }]}>{habit.description}</Text>
      <Text style={[styles.info, { color: colors.text }]}>{habit.frequency} times a week</Text>
      <Text style={[styles.info, { color: colors.text }]}>Current streak: {habit.currentStreak} days</Text>
      <View style={styles.section}>
        <Text style={[styles.title, styles.subtitle, { color: habit.color, backgroundColor: colors.cardHeader, textShadowColor: colors.textShadow }]}>Calendar</Text>
        <HabitCalendar habit={habit} nChecks={100} onCheck={onCheck} paddingHorizontal={15} />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 300,
    maxHeight: 450,
    borderRadius: 10,
    margin: '1%',
    shadowColor: 'hsl(0, 0%, 0%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  section: {
    marginTop: 15,
  },
  subtitle: {
    fontSize: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
    paddingHorizontal: 15,
  },
  habitChecks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
  habitCheck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
    width: 36,
    textAlign: 'center',
  },
});
