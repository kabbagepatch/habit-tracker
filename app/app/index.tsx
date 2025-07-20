import { useCallback, useContext, useEffect, useState } from 'react';
import { StatusBar, Text, View, FlatList, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
// @ts-ignore
import { useRouter, useLocalSearchParams } from 'expo-router';

import Login from './components/login';
import HabitCard from './components/card';
import Loading from './components/loading';

import { habitService } from '../service';
import useUserInfo from '../hooks/useUserInfo';
import { HabitsContext } from '@/hooks/HabitContext';
import { useTheme } from '@/hooks/useTheme';
import { calculateStreaks, updateHabitCheckIn } from './util';

export default function Index() {
  const { replace } = useLocalSearchParams();
  const router = useRouter();
  const { loading : loadingUser, user } = useUserInfo();
  const [loadingHabits, setLoadingHabits] = useState(true);
  const { colors } = useTheme();

  const { allHabits, setAllHabits, updateHabit, deleteHabit } = useContext(HabitsContext);

  const retrieveHabits = async () => {
    setLoadingHabits(true);
    const habits = await habitService.getHabits();
    setLoadingHabits(false);
    if (habits) {
      Object.keys(habits).forEach((key) => {
        const streakInfo = calculateStreaks(habits[key]);
        habits[key].currentStreak = streakInfo.currentStreak;
        habits[key].sanitisedCheckInMasks = streakInfo.updatedMasks || habits[key].checkInMasks;
      });
      setAllHabits(habits);
    }
  }

  const onCheck = useCallback(async (habitId : string, date : Date, isChecked : boolean) => {
    // Optimistically update the habit
    const updatedHabit = updateHabitCheckIn(allHabits[habitId], date, !isChecked);
    updateHabit?.(habitId, updatedHabit);

    habitService.checkIn(habitId, date, !isChecked).then((returnedHabit) => {
      if (returnedHabit && returnedHabit.checkInMasks[date.getFullYear()] !== updatedHabit.checkInMasks[date.getFullYear()]) {
        updateHabit?.(habitId, returnedHabit);
      }
    });
  }, [allHabits]);

  const onUpdate = useCallback((habitId : string) => {
    router.navigate(`/${habitId}/update`);
  }, []);

  const onDelete = useCallback(async (habitId : string) => {
    if (confirm('Are you sure you want to delete this habit?') === false) return;
    habitService.deleteHabit(habitId);
    deleteHabit?.(habitId);
  }, []);

  useEffect(() => {
    if (user || replace) {
      retrieveHabits();
      if (replace) {
        router.replace('/');
      }
    }
  }, [user, replace]);

  if (loadingUser) return <Loading />;
  if (!user) return <Login />;
  if (loadingHabits) return <Loading />;

  if (Object.keys(allHabits).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, color: colors.text }}>No habits found</Text>
        <FAB
          style={styles.createButton}
          icon='plus'
          onPress={() => router.navigate('/create')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.habitsContainer}>
        <FlatList
          style={{ paddingBottom: 70 }}
          data={Object.keys(allHabits)}
          keyExtractor={(item : any) => item.toString()}
          renderItem={({ item: key }) => {
            const item = allHabits[key];
            return (
              <HabitCard
                id={key}
                item={item}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onCheck={onCheck}
              />
            )
          }}
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
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'hsla(0, 100%, 71%, 1)'
  }
});
