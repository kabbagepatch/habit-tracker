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
