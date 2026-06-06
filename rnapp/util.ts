export function getDayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = current - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function updateHabitCheckIn(habit : Habit, date : Date, status : boolean) : Habit {
  const updatedHabit = { ...habit };
  const day = getDayOfYear(date);
  const initialMask = updatedHabit.checkInMasks[date.getFullYear()];
  const updatedMask = initialMask.substring(0, day - 1) + (status ? '1' : '0') + initialMask.substring(day);
  updatedHabit.checkInMasks = { ...updatedHabit.checkInMasks, [date.getFullYear()]: updatedMask };
  // updatedHabit.currentStreak = calculateLast75DaysCount(updatedHabit);

  const streakInfo = calculateStreaks(updatedHabit);
  updatedHabit.currentStreak = streakInfo.currentStreak;
  updatedHabit.sanitisedCheckInMasks = streakInfo.updatedMasks || updatedHabit.checkInMasks;

  return updatedHabit;
}

export function calculateLast75DaysCount(habit: Habit): number {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 75);
  const startDayOfYear = getDayOfYear(startDate);
  const todayDayOfYear = getDayOfYear(today);
  const year = today.getFullYear();
  const mask = habit.checkInMasks[year] || '';
  let count = 0;
  for (let i = startDayOfYear; i <= todayDayOfYear; i++) {
    if (mask[i - 1] === '1') {
      count++;
    }
  }
  return count;
}

export function calculateBestStreak(habit: Habit): number {
  const masks = habit.sanitisedCheckInMasks || habit.checkInMasks;
  const years = Object.keys(masks).map(k => parseInt(k, 10)).sort((a, b) => a - b);
  let best = 0;
  let current = 0;
  for (const year of years) {
    const mask = masks[year];
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === '1' || mask[i] === '2') {
        current++;
        if (current > best) best = current;
      } else {
        current = 0;
      }
    }
    // Don't reset between years — streaks can span year boundaries
  }
  return best;
}

export function calculateTotalCheckIns(habit: Habit): number {
  return Object.values(habit.checkInMasks).reduce((total, mask) => {
    for (const char of mask) {
      if (char === '1') total++;
    }
    return total;
  }, 0);
}

export function getWeeklyCheckIns(habit: Habit, numWeeks: number): number[] {
  const result: number[] = [];
  const today = new Date();
  for (let w = numWeeks - 1; w >= 0; w--) {
    let count = 0;
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + d));
      const year = date.getFullYear();
      const day = getDayOfYear(date);
      const mask = habit.checkInMasks[year];
      if (mask && mask[day - 1] === '1') count++;
    }
    result.push(count);
  }
  return result;
}

export function getHeatmapData(habit: Habit, numWeeks: number): { date: Date, status: string }[][] {
  const masks = habit.sanitisedCheckInMasks || habit.checkInMasks;
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat

  // Start from the Sunday of the oldest week
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek - (numWeeks - 1) * 7);

  const columns: { date: Date, status: string }[][] = [];
  for (let w = 0; w < numWeeks; w++) {
    const column: { date: Date, status: string }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + d);
      if (date > today) {
        column.push({ date, status: 'future' });
      } else {
        const year = date.getFullYear();
        const day = getDayOfYear(date);
        const mask = masks[year];
        column.push({ date, status: mask ? (mask[day - 1] || '0') : '0' });
      }
    }
    columns.push(column);
  }
  return columns;
}

export function calculateStreaks(habit : Habit): { currentStreak: number, updatedMasks?: { [key: number]: string } } {
  const { checkInMasks, frequency } = habit;
  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const dayOfYear = getDayOfYear(curDate);

  let updatedMasks : { [key: number]: string } = {};

  Object.keys(checkInMasks).map(k => parseInt(k, 10)).forEach((year : number) => {
    if (year > curYear) return; // Skip future years

    const mask = [...checkInMasks[year]];
    let nextYearMasks = checkInMasks[year + 1] || '0'.repeat(6);
    let prevYearMasks = checkInMasks[year - 1] || '0'.repeat(6);

    const lastDayOfYear = mask.length;
    let runningCheckCount = 0;
    for (let j = 0; j < 6; j++) {
      if (nextYearMasks[j] === '1') {
        runningCheckCount++;
      }
    }
    for (let i = lastDayOfYear + 6; i >= 0; i -= 1) {
      if (i > lastDayOfYear - 1) {
        runningCheckCount -= nextYearMasks[i - lastDayOfYear - 1] === '1' ? 1 : 0;
      } else {
        runningCheckCount -= mask[i] === '1' ? 1 : 0;
      }

      if (i >= 7) {
        runningCheckCount += mask[i - 7] === '1' ? 1 : 0;
      } else {
        runningCheckCount += prevYearMasks[prevYearMasks.length + i - 7] === '1' ? 1 : 0;
      }
      if (runningCheckCount >= frequency) {
        for (let j = 0; j < 7; j++) {
          if (i - j < 1) continue;
          if (mask[i - j - 1] === '0') {
            mask[i - j - 1] = '2';
          }
        }
      }
    }

    updatedMasks[year] = mask.join('');
  });
  
  let currentStreak = 0;
  let i = 0;
  for (i = dayOfYear; i > 0; i -= 1) {
    if (updatedMasks[curYear][i - 1] !== '0') {
      currentStreak++;
    } else {
      while (i < dayOfYear && updatedMasks[curYear][i] === '2') {
        currentStreak--;
        updatedMasks[curYear] = updatedMasks[curYear].substring(0, i) + '0' + updatedMasks[curYear].substring(i + 1);
        i += 1;
      }
      if (i !== dayOfYear) {
        break;
      }
    }
  }
  let year = curYear;
  while (i === 0 && updatedMasks[year][i] !== '0') {
    year -= 1;
    for (i = updatedMasks[year].length; i > 0; i -= 1) {
      if (updatedMasks[year][i - 1] !== '0') {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, updatedMasks };
}
