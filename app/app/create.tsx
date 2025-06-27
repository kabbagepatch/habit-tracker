import { useContext, useState } from 'react';
// @ts-ignore
import { useRouter } from 'expo-router';

import Login from './components/login';
import HabitForm from './components/form';
import Loading from './components/loading';

import { habitService } from '@/service';
import useUserInfo from '@/hooks/useUserInfo';
import { HabitsContext } from '@/hooks/HabitContext';

export default function Create() {
  const router = useRouter();
  const { loading, user } = useUserInfo();

  const [submitting, setSubmitting] = useState(false);

  const { setHabit } = useContext(HabitsContext);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  const onSubmit = async (name: string, description: string, frequency: number, color: string) => {
    setSubmitting(true);
    const newHabit = await habitService.createHabit({name, description, frequency, color});
    if (newHabit) setHabit?.(newHabit);
    setSubmitting(false);
    router.dismissTo('/');
  }

  return (
    <HabitForm submitting={submitting} onSubmit={onSubmit} />
  )
};
