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
    setUserHabits(userHabits.map((h, i) => i === habitInd ? { ...h, checkIns: updatedHabit.checkIns } : h));
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
        <View style={styles.habit}>
          <View style={styles.habitName}></View>
          <Text style={styles.date}>{new Date().getDate()}</Text>
          <Text style={styles.date}>{new Date().getDate() - 1}</Text>
          <Text style={styles.date}>{new Date().getDate() - 2}</Text>
          <Text style={styles.date}>{new Date().getDate() - 3}</Text>
          <Text style={styles.date}>{new Date().getDate() - 4}</Text>
        </View>
        <FlatList
          data={userHabits}
          keyExtractor={(item : any) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.habitContainer}>
              <View style={styles.habit}>
                <Text style={styles.habitName}>{item.name}</Text>
                <Checkbox status={isCheckedToday(item) ? 'checked' : 'unchecked'} color='#BB86FC' onPress={() => onCheck(index)}/>
                <Checkbox status={isCheckedToday(item, 1) ? 'checked' : 'unchecked'} color='#BB86FC' onPress={() => onCheck(index, 1)} />
                <Checkbox status={isCheckedToday(item, 2) ? 'checked' : 'unchecked'} color='#BB86FC' onPress={() => onCheck(index, 2)} />
                <Checkbox status={isCheckedToday(item, 3) ? 'checked' : 'unchecked'} color='#BB86FC' onPress={() => onCheck(index, 3)} />
                <Checkbox status={isCheckedToday(item, 4) ? 'checked' : 'unchecked'} color='#BB86FC' onPress={() => onCheck(index, 4)} />
              </View>
              <IconButton icon='delete' iconColor='#F00A' onPress={() => onDelete(index)} />
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
    justifyContent: 'space-between'
  },
  habit: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  habitName: {
    width: 100,
    fontSize: 18,
    paddingRight: 10,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#BB86FC'
  }
});
