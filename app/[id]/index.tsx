import { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import { useLocalSearchParams, useRouter } from 'expo-router';

import Login from '@/components/login';
import Loading from '@/components/loading';
import { habitService } from '@/service';
import useUserInfo from '@/hooks/useUserInfo';
import HabitCalendar from '@/components/calendar';
import { HabitsContext } from '@/hooks/HabitContext';
import { useTheme } from '@/hooks/useTheme';
import { useNotification } from '@/hooks/NotificationContext';
import { calculateStreaks, updateHabitCheckIn } from '@/util';
import { IconButton } from 'react-native-paper';
import StatsRow from '@/components/stats';
import WeeklyChart from '@/components/chart';

export default function ViewHabit() {
  const { loading, user } = useUserInfo();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loadingHabit, setLoadingHabit] = useState(true);

  const { allHabits, updateHabit, deleteHabit } = useContext(HabitsContext);
  const { colors } = useTheme();
  const { showNotification } = useNotification();
  const router = useRouter();

  const retrieveHabit = async (id : string) => {
    if (allHabits && allHabits[id]) {
      setLoadingHabit(false);
      return;
    }

    const retrievedHabit = await habitService.getHabit(id);
    if (retrievedHabit) {
      const streakInfo = calculateStreaks(retrievedHabit);
      retrievedHabit.currentStreak = streakInfo.currentStreak;
      retrievedHabit.sanitisedCheckInMasks = streakInfo.updatedMasks || retrievedHabit.checkInMasks;
      updateHabit?.(id, retrievedHabit);
    }
    setLoadingHabit(false);
  }

  useEffect(() => {
    if (user) {
      retrieveHabit(id);
    }
  }, [user]);

  const habit = allHabits[id];

  const onCheck = useCallback(async (date : Date, isChecked : boolean) => {
    if (!id || !habit) return;
    // Optimistically update the habit
    const updatedHabit = updateHabitCheckIn(habit, date, !isChecked);
    updateHabit?.(id, updatedHabit);

    habitService.checkIn(id, date, !isChecked).then((returnedHabit) => {
      if (returnedHabit && returnedHabit.checkInMasks[date.getFullYear()] !== updatedHabit.checkInMasks[date.getFullYear()]) {
        updateHabit?.(id, returnedHabit);
      }
    });
  }, [habit, id]);

  const onUpdate = useCallback((habitId : string) => {
    router.navigate(`/${habitId}/update`);
  }, []);

  const doDelete = async (habitId: string) => {
    const success = await habitService.deleteHabit(habitId);
    if (!success) {
      showNotification('Failed to delete habit. Please try again.', 'error');
      return;
    }
    deleteHabit?.(habitId);
    showNotification('Habit succesfully deleted.');
    router.navigate('/');
  };

  const onDelete = useCallback((habitId : string) => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this habit?') === false) return;
      doDelete(habitId);
      return;
    }

    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => doDelete(habitId),
        style: 'destructive',
      },
    ]);
  }, [habit]);

  if (loading) return <Loading />
  if (!user) return <Login />;
  if (loadingHabit) return <Loading />
  if (!habit) return <Text>Habit not found</Text>

  const textStyle = { color: habit.color, backgroundColor: colors.cardHeader, textShadowColor: colors.textShadow };
  return (
    <View style={[styles.container, { backgroundColor: colors.card, maxHeight: habit.description ? 720 : 680 }]}>
      <View style={[styles.titleContainer, {backgroundColor: colors.cardHeader}]}>
        <Text style={[styles.title, { color: habit.color, textShadowColor: colors.textShadow }]}>{habit.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon='pencil' iconColor={habit.color || 'hsl(204, 100%, 50%)'} style={{ margin: 0 }} onPress={() => onUpdate(habit.id)} />
          <IconButton icon='delete' iconColor='hsl(0, 100%, 50%)' style={{ margin: 0 }} onPress={() => onDelete(habit.id)} />
        </View>
      </View>
      {habit.description && <Text style={[styles.info, { color: habit.color }]}>{habit.description}</Text>}
      <StatsRow habit={habit} />
      <View style={styles.section}>
        <Text style={[styles.title, styles.subtitle, textStyle]}>Weekly History</Text>
        <View style={styles.sectionContent}><WeeklyChart habit={habit} /></View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.title, styles.subtitle, textStyle]}>Calendar</Text>
        <View style={styles.sectionContent}>
          <HabitCalendar
            habit={habit}
            nChecks={habit.currentStreak ? Math.max(habit.currentStreak, 1000) : 1000}
            onCheck={onCheck}
            overflowY="scroll"
            size={24}
          />
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 300,
    maxHeight: 650,
    borderRadius: 10,
    margin: '1%',
    shadowColor: 'hsl(0, 0%, 0%)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 24,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 5,
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  section: {
    marginTop: 5,
  },
  sectionContent: {
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  info: {
    fontSize: 18,
    paddingTop: 8,
    paddingHorizontal: 15,
  },
});
