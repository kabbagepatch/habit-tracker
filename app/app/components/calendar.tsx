import React, { useRef } from 'react';
import { DimensionValue, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDayOfYear } from '../util';

export default function HabitCalendar({ habit, nChecks, onCheck, height, paddingHorizontal } : { habit: Habit, nChecks: number, onCheck: (date: Date, isChecked: boolean) => void, height?: DimensionValue, paddingHorizontal?: DimensionValue }) {
  const { color, checkInMasks } = habit;

  const isCheckedOn = (date : Date) => {
    const day = getDayOfYear(date);
    return checkInMasks[date.getFullYear()][day - 1] === "1";
  }

  const debouncingRef = useRef(false);

  const onPress = (date: Date, isChecked: boolean) => {
    if (debouncingRef.current) return;
    debouncingRef.current = true;
    setTimeout(() => {
      debouncingRef.current = false;
    }, 300);
    if (onCheck) {
      onCheck(date, isChecked);
    }
  }

  return (
    <View style={[styles.habitChecks, { height: height || 200, paddingHorizontal: paddingHorizontal || 0 }]}>
      {
        Array.from({ length: nChecks }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const checkedColor = color || 'hsl(0, 0%, 60%)';
          const unCheckedColor = color ? color.replace(', 1)', ', 0.25)') :'hsla(0, 0%, 60%, 0.25)';
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onPress(date, isCheckedOn(date))}
              style={[styles.habitCheck, { backgroundColor: isCheckedOn(date) ? checkedColor : unCheckedColor }]}
            >
              <Text key={i} style={styles.date}>{date.getDate()}</Text>
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
    overflow: 'hidden',
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
