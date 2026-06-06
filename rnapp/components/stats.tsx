import { StyleSheet, Text, View } from 'react-native';
import { calculateBestStreak, calculateTotalCheckIns } from '@/util';

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.chip, { borderColor: color.replace(', 1)', ', 0.3)') }]}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function StatsRow({ habit }: { habit: Habit }) {
  const bestStreak = calculateBestStreak(habit);
  const total = calculateTotalCheckIns(habit);

  const createdAt = new Date(habit.createdAt);
  const today = new Date();
  const daysTracked = Math.max(1, Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const rate = Math.min(100, Math.round((total / daysTracked) * 100));

  return (
    <View style={styles.row}>
      <Stat label="Streak" value={`${habit.currentStreak || 0}d`} color={habit.color} />
      <Stat label="Best" value={`${bestStreak}d`} color={habit.color} />
      <Stat label="Total" value={`${total}`} color={habit.color} />
      <Stat label="Rate" value={`${rate}%`} color={habit.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginVertical: 10,
    gap: 8,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 10,
    color: 'hsl(0, 0%, 50%)',
    marginTop: 2,
  },
});
