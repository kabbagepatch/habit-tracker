import { Text, View, StyleSheet, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
// @ts-ignore
import { useRouter } from 'expo-router';

import HabitCalendar from './calendar';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  id: string;
  item: Habit;
  onCheck: (habitId: string, date: Date, isChecked: boolean) => void;
}

export default function HabitCard({ id, item, onCheck }: Props) {
  const router = useRouter();  
  const { colors } = useTheme();

  return (
    <View style={[styles.habitContainer, { backgroundColor: colors.card }]}>
      <View style={styles.habit}>
        <View style={styles.habitNameContainer}> 
          <Text style={[styles.habitName, { color: (item.color || 'hsl(0, 0%, 60%)') }]} onPress={() => router.navigate(`/${item.id}`)}>
            {item.name}
          </Text>
          <Text style={[styles.habitName, { color: (item.color || 'hsl(0, 0%, 60%)') }]} onPress={() => router.navigate(`/${item.id}`)}>
            {item.currentStreak || '0'}
          </Text>
        </View>
        <HabitCalendar habit={item} nChecks={15} onCheck={(date, isChecked) => onCheck(id, date, isChecked)} height={50} />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  habitContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    marginBottom: 10,
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  habitButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
