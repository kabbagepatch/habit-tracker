import React, { useMemo, useRef } from 'react';
import { DimensionValue, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getDayOfYear } from '@/util';

interface CheckProps {
  date: Date;
  color: string;
  size: number;
  checkInMasks: { [key: number]: string };
  onPress: (date: Date) => void;
};

function HabitCheck({ date, color, checkInMasks, size=32, onPress }: CheckProps) {  
  const checkedType = useMemo(() => {
    const day = getDayOfYear(date);
    if (!checkInMasks || !checkInMasks[date.getFullYear()]) return '0'; // Unchecked
    return checkInMasks[date.getFullYear()][day - 1] || '0'; // Default to unchecked
  }, [checkInMasks[date.getFullYear()]]);

  const textColor = checkedType === '0' ? 'hsla(0, 0%, 60%, 0.5)' : 'black';
  const checkColor = useMemo(() => {
    const checkedColor = color || 'hsl(0, 0%, 60%)';
    const halfCheckedColor = color ? color.replace(', 1)', ', 0.4)') :'hsla(0, 0%, 60%, 0.15)';
    const uncheckedColor = color ? color.replace(', 1)', ', 0.1)') :'hsla(0, 0%, 60%, 0.15)';

    switch (checkedType) {
      case '1':
        return checkedColor; // Checked
      case '2':
        return halfCheckedColor; // Half-checked
      case '0':
        return uncheckedColor; // Unchecked
    }
  }, [color, checkedType]);

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      style={[styles.habitCheck, { backgroundColor: checkColor, width: size, height: size }]}
    >
      {(date.getDate() !== 1) && 
        <Text style={[styles.date, { fontSize: (size - 4) / 2, color: textColor }]}>
          {date.getDate()}
        </Text>
      }
      {(date.getDate() === 1) && (date.getMonth() !== 0) &&
        <Text style={{ color: checkedType === '0' ? color : 'black', fontSize: (size - 10) / 2 }}>
          {date.toLocaleString('default', { month: 'short' })}
        </Text>
      }
      {(date.getDate() === 1) && (date.getMonth() === 0) &&
        <Text style={{ color: checkedType === '0' ? color : 'black', fontSize: (size - 10) / 2 }}>
          {date.toLocaleString('default', { year: 'numeric' })}
        </Text>
      }
    </TouchableOpacity>
  );
}

interface CalendarProps {
  habit: Habit;
  nChecks: number;
  onCheck: (date: Date, isChecked: boolean) => void;
  height?: DimensionValue;
  overflowY?: string;
  size?: number;
};

export default function HabitCalendar({ habit, nChecks, onCheck, height, overflowY, size=36 } : CalendarProps) {
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
    const mask = checkInMasksToUse[date.getFullYear()];
    if (onCheck && mask) {
      onCheck(date, mask[day - 1] === "1");
    }
  }

  return (
    <View style={{ height: height || 300, backgroundColor: 'transparent', overflow: 'hidden' }}>
      <View style={[styles.habitChecks, { height: height || 300, backgroundColor: 'transparent', overflowY: overflowY || 'hidden' }]}>
        {
          Array.from({ length: nChecks }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return (
              <HabitCheck
                key={i}
                date={date}
                color={color}
                size={size}
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
