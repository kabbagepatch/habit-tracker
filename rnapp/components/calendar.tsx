import React, { useMemo, useRef } from 'react';
import { DimensionValue, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getDayOfYear } from '@/util';

function HabitCheck({ date, color, checkInMasks, onPress }: { date: Date, color: string, checkInMasks: { [key: number]: string }, onPress: (date: Date) => void }) {  
  const checkedType = useMemo(() => {
    const day = getDayOfYear(date);
    if (!checkInMasks || !checkInMasks[date.getFullYear()]) return '0'; // Unchecked
    return checkInMasks[date.getFullYear()][day - 1] || '0'; // Default to unchecked
  }, [checkInMasks[date.getFullYear()]]);

  const checkColor = useMemo(() => {
    const checkedColor = color || 'hsl(0, 0%, 60%)';
    const halfCheckedColor = color ? color.replace(', 1)', ', 0.15)') :'hsla(0, 0%, 60%, 0.15)';
    const uncheckedColor = 'hsla(0, 0%, 50%, 0.10)'

    switch (checkedType) {
      case '1':
        return checkedColor; // Checked
      case '2':
        return halfCheckedColor; // Half-checked
      case '0':
        return halfCheckedColor; // Unchecked
      default:
        return uncheckedColor; // Default to unchecked
    }
  }, [color, checkedType]);

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      style={[styles.habitCheck, { backgroundColor: checkColor }]}
    >
      <Text style={styles.date}>{date.getDate()}</Text>
      {(date.getDate() === 1) &&
        <Text style={{ color: checkedType === '0' ? color : 'black', fontSize: 10 }}>{date.toLocaleString('default', { month: 'short' })}</Text>
      }
    </TouchableOpacity>
  );
}

export default function HabitCalendar({ habit, nChecks, onCheck, height, paddingHorizontal, overflowY } : { habit: Habit, nChecks: number, onCheck: (date: Date, isChecked: boolean) => void, height?: DimensionValue, paddingHorizontal?: DimensionValue, overflowY?: string }) {
  const { color, checkInMasks, sanitisedCheckInMasks } = habit;
  const checkInMasksToUse = sanitisedCheckInMasks || checkInMasks;

  const debouncingRef = useRef(false);

  const onPress = (date: Date) => {
    const day = getDayOfYear(date);
    if (debouncingRef.current) return;
    debouncingRef.current = true;
    setTimeout(() => {
      debouncingRef.current = false;
    }, 300);
    if (onCheck) {
      onCheck(date, checkInMasksToUse[date.getFullYear()][day - 1] === "1");
    }
  }

  return (
    <View style={{ height: height || 400, backgroundColor: 'transparent', overflow: 'hidden' }}>
      <View style={[styles.habitChecks, { height: height || 400, backgroundColor: 'transparent', paddingHorizontal: paddingHorizontal || 0, overflowY: overflowY || 'hidden' }]}>
        {
          Array.from({ length: nChecks }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return (
              <HabitCheck
                key={i}
                date={date}
                color={color}
                checkInMasks={checkInMasksToUse}
                onPress={onPress}
              />
            );
          })
        }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  habitChecks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  habitCheck: {
    width: 36,
    height: 36,
    borderRadius: 20,
    margin: 3,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
    width: 32,
    textAlign: 'center',
  },
});
