import { getWeeklyCheckIns } from '@/util';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const MAX_BAR_HEIGHT = 92;
const GRID_LEVELS = [0, 0.33, 0.67, 1];

export default function WeeklyChart({ habit }: { habit: Habit }) {
  const color = habit.color;
  const frequency = habit.frequency;
  const { width } = useWindowDimensions();
  const weeklyData = getWeeklyCheckIns(habit, Math.max(Math.floor(width / 35), 12));

  return (
    <View style={styles.wrapper}>
      <View style={styles.chart}>
        {/* Grid lines rendered first so they sit behind bars */}
        {GRID_LEVELS.map((level) => {
          return (
            <View
              key={level}
              style={[styles.gridLine, { bottom: MAX_BAR_HEIGHT * level + 15 }, styles.gridLineRegular]}
            />
          );
        })}
        {weeklyData.map((count, i) => {
          const barHeight = frequency > 0
            ? Math.min(MAX_BAR_HEIGHT, Math.round((count / frequency) * MAX_BAR_HEIGHT))
            : 0;
          const barColor = count >= frequency ? color : color.replace(', 1)', ', 0.45)');
          const d = new Date();
          d.setDate(d.getDate() - (d.getDay() % 7));
          d.setDate(d.getDate() - (weeklyData.length - i - 1) * 7);
          return (
            <View key={i} style={styles.barSlot}>
              {barHeight > 0 && (
                <View>
                  <Text style={[styles.count, { color }]}>{count}</Text>
                  <View style={[styles.bar, { height: barHeight, backgroundColor: barColor }]} />
                </View>
              )}
              <Text style={[styles.weekText, { color }]}>{`${d.getMonth() + 1}/${d.getDate()}`}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: MAX_BAR_HEIGHT + 24,
    marginTop: 12,
    marginBottom: 4,
    justifyContent: 'flex-end',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: MAX_BAR_HEIGHT,
    gap: 3,
  },
  barSlot: {
    flex: 1,
    justifyContent: 'flex-end',
    height: MAX_BAR_HEIGHT,
  },
  count: {
    width: '100%',
    textAlign: 'center',
    paddingBottom: 2,
  },
  bar: {
    width: '100%',
    borderRadius: 3,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineRegular: {
    backgroundColor: 'hsla(0, 0%, 50%, 0.2)',
  },
  weeks: {
    marginRight: -5,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  weekText: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 10,
  },
});
