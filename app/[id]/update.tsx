import { useContext, useEffect, useState } from 'react';
// @ts-ignore
import { useRouter, useLocalSearchParams } from 'expo-router';

import Login from '@/components/login';
import HabitForm from '@/components/form';
import Loading from '@/components/loading';
import { habitService } from '@/service';
import useUserInfo from '@/hooks/useUserInfo';

import { HabitsContext } from '@/hooks/HabitContext';
import { useNotification } from '@/hooks/NotificationContext';
import { calculateStreaks } from '@/util';

export default function Update() {
  const router = useRouter();
  const { loading, user } = useUserInfo();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loadingHabit, setLoadingHabit] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [habit, setHabit] = useState<Habit | undefined>(undefined);

  const { allHabits, updateHabit } = useContext(HabitsContext);
  const { showNotification } = useNotification();

  const retrieveHabit = async (id : string) => {
    if (allHabits && allHabits[id]) {
      setHabit(allHabits[id]);
      setLoadingHabit(false);
      return;
    }

    const retrievedHabit = await habitService.getHabit(id);
    if (retrievedHabit) {
      setHabit(retrievedHabit);
    }
    setLoadingHabit(false);
  }

  useEffect(() => {
    if (user) {
      retrieveHabit(id);
    }
  }, [user]);

  if (loading) return <Loading />
  if (!user) return <Login />;
  if (loadingHabit) return <Loading />

  const onSubmit = async (name: string, description: string, frequency: number, color: string) => {
    setSubmitting(true);
    const updatedHabit = await habitService.updateHabit(id, { name, description, frequency, color });
    setSubmitting(false);
    if (!updatedHabit) {
      showNotification('Failed to update habit. Please try again.', 'error');
      return;
    }
    if (habit && habit.frequency !== frequency) {
      const streakInfo = calculateStreaks({ ...habit, frequency });
      const currentStreak = streakInfo.currentStreak;
      const sanitisedCheckInMasks = streakInfo.updatedMasks || habit.checkInMasks;
      updateHabit?.(id, { name, description, frequency, color, currentStreak, sanitisedCheckInMasks });
    } else {
      updateHabit?.(id, { name, description, frequency, color });
    }
    showNotification('Habit succesfully updated.');
    router.dismissTo(`/${id}`);
  }

  return (
    <HabitForm existingHabit={habit} submitting={submitting} onSubmit={onSubmit} />
  )
};
