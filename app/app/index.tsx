import { useContext, useEffect, useState } from 'react';
import { StatusBar, Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
// @ts-ignore
import { useRouter, useLocalSearchParams } from 'expo-router';


import Login from './components/login';
import HabitCalendar from './components/calendar';
import Loading from './components/loading';
import { habitService } from '../service';
import useUserInfo from '../hooks/useUserInfo';
import { HabitsContext } from '@/hooks/HabitContext';

export default function Index() {
  const { replace } = useLocalSearchParams();
  const router = useRouter();
  const { loading : loadingUser, user } = useUserInfo();
  const [loadingHabits, setLoadingHabits] = useState(true);

  const { allHabits, setAllHabits, updateHabit, deleteHabit } = useContext(HabitsContext);

  const retrieveHabits = async () => {
    setLoadingHabits(true);
    const habits = await habitService.getHabits();
    setLoadingHabits(false);
    if (habits) {
      setAllHabits(habits);
    }
  }

  const onCheck = async (habitId : string, date : Date, isChecked : boolean) => {
    const dateString = date.toLocaleDateString();

    // Optimistically update the habit
    const updatedHabit = { ...allHabits[habitId] };
    const checkInInd = updatedHabit.checkIns.findIndex((checkIn : any) => checkIn.date == dateString);
    if (checkInInd === -1) {
      updatedHabit.checkIns.push({ date: dateString, status: !isChecked });
    } else {
      updatedHabit.checkIns[checkInInd].status = !isChecked;
    }
    updateHabit?.(habitId, updatedHabit);

    habitService.checkIn(habitId, dateString, !isChecked).then((updatedHabit) => {
      if (updatedHabit) {
        updateHabit?.(habitId, updatedHabit);
      }
    });
  }

  const onUpdate = (habitId : string) => {
    console.log('onUpdate', habitId);
    router.navigate(`/${habitId}/update`);
  }

  const onDelete = async (habitId : string) => {
    if (confirm('Are you sure you want to delete this habit?') === false) return;
    habitService.deleteHabit(habitId);
    deleteHabit?.(habitId);
  }

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
        <Text style={{ fontSize: 20 }}>No habits found</Text>
        <FAB
          style={styles.createButton}
          icon='plus'
          onPress={() => router.navigate('/create')}
        />
      </View>
    );
  }

  const isCheckedToday = (habit : Habit) => {
    const dateString = (new Date()).toLocaleDateString();
    const checkInInd = habit.checkIns.findIndex((checkIn : any) => checkIn.date == dateString);
    if (checkInInd === -1) {
      return false
    } else {
      return habit.checkIns[checkInInd].status;
    }
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
            return (<View style={styles.habitContainer}>
              <View style={styles.habit}>
                <View style={styles.habitNameContainer}> 
                  <Text style={[styles.habitName, { color: (item.color || 'hsl(0, 0%, 60%)') }]} onPress={() => router.navigate(`/${item.id}`)}>
                    {item.name + ` (${isCheckedToday(item) ? item.currentStreak : 0})`}
                  </Text>
                  <View style={styles.habitButtons}>
                    <IconButton icon='pencil' iconColor='hsla(204, 100.00%, 50.00%, 0.66)' style={{ margin: 0 }} onPress={() => onUpdate(item.id)} />
                    <IconButton icon='delete' iconColor='hsla(0, 100%, 50%, 0.66)' style={{ margin: 0 }} onPress={() => onDelete(item.id)} />
                  </View>
                </View>
                <HabitCalendar habit={item} nChecks={15} onCheck={(date, isChecked) => onCheck(key, date, isChecked)} height={50} />
              </View>
            </View>)
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    backgroundColor: 'hsla(0, 100%, 71%, 1)'
  }
});
