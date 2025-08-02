import { Text, View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
// @ts-ignore
import { useRouter } from 'expo-router';

import HabitCalendar from './calendar';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  id: string;
  item: Habit;
  onUpdate: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  onCheck: (habitId: string, date: Date, isChecked: boolean) => void;
}

export default function HabitCard({ id, item, onUpdate, onDelete, onCheck }: Props) {
  const router = useRouter();  
  const { colors } = useTheme();

  return (
    <View style={[styles.habitContainer, { backgroundColor: colors.card }]}>
      <View style={styles.habit}>
        <View style={styles.habitNameContainer}> 
          <Text style={[styles.habitName, { color: (item.color || 'hsl(0, 0%, 60%)') }]} onPress={() => router.navigate(`/${item.id}`)}>
            {item.name + ` (${item.currentStreak || '0'}/75)`}
          </Text>
          <View style={styles.habitButtons}>
            <IconButton icon='pencil' iconColor={item.color || 'hsl(204, 100%, 50%)'} style={{ margin: 0 }} onPress={() => onUpdate(item.id)} />
            <IconButton icon='delete' iconColor='hsl(0, 100%, 50%)' style={{ margin: 0 }} onPress={() => onDelete(item.id)} />
          </View>
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
});
