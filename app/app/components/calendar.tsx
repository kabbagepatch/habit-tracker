import React, { useRef } from 'react';
import { DimensionValue, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDayOfYear } from '../util';

export default function HabitCalendar({ habit, nChecks, onCheck, height, paddingHorizontal, overflowY } : { habit: Habit, nChecks: number, onCheck: (date: Date, isChecked: boolean) => void, height?: DimensionValue, paddingHorizontal?: DimensionValue, overflowY?: string }) {
  const { color, checkInMasks, sanitisedCheckInMasks } = habit;
  const checkInMasksToUse = sanitisedCheckInMasks || checkInMasks;

  const getCheckedType = (date: Date) => {
    const day = getDayOfYear(date);
    if (!checkInMasksToUse || !checkInMasksToUse[date.getFullYear()]) return '0'; // Unchecked
    return checkInMasksToUse[date.getFullYear()][day - 1] || '0'; // Default to unchecked
  }

  const getCheckedColor = (color: string, date : Date) => {
    const checkedColor = color || 'hsl(0, 0%, 60%)';
    const halfCheckedColor = color ? color.replace(', 1)', ', 0.45)') :'hsla(0, 0%, 60%, 0.45)';
    const uncheckedColor = 'hsla(0, 0%, 100%, 0.10)'

    switch (getCheckedType(date)) {
      case '1':
        return checkedColor; // Checked
      case '2':
        return halfCheckedColor; // Half-checked
      case '0':
        return uncheckedColor; // Unchecked
      default:
        return uncheckedColor; // Default to unchecked
    }
  }

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
    <View style={[styles.habitChecks, { height: height || 400, paddingHorizontal: paddingHorizontal || 0, overflowY: overflowY || 'hidden' }]}>
      {
        Array.from({ length: nChecks }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onPress(date)}
              style={[styles.habitCheck, { backgroundColor: getCheckedColor(color, date) }]}
            >
              <Text key={i} style={styles.date}>{date.getDate()}</Text>
              {(date.getDate() === 1) &&
                <Text style={{ color: getCheckedType(date) === '0' ? color : 'black', fontSize: 10 }}>{date.toLocaleString('default', { month: 'short' })}</Text>
              }
            </TouchableOpacity>
          );
        })
      }
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
