import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Login from '../components/login';
import HabitForm from '../components/form';
import { habitService } from '@/service';
import useUserInfo from '@/hooks/useUserInfo';

export default function Update() {
  const router = useRouter();
  const { loading, user } = useUserInfo();
  // const { id } = router.params.id;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loadingHabit, setLoadingHabit] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState(0);
  const [color, setColor] = useState('');

  const getHabit = async (id : string) => {
    const habit = await habitService.getHabit(id);
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);
      setFrequency(habit.frequency);
      setColor(habit.color);
    }
    setLoadingHabit(false);
  }

  useEffect(() => {
    if (user) {
      getHabit(id);
    }
  }, [user]);

  if (loading) return <Text>Loading...</Text>
  if (!user) return <Login />;
  if (loadingHabit) return <Text>Loading...</Text>

  const onSubmit = async (name: string, description: string, frequency: number, color: string) => {
    await habitService.updateHabit(id, {name, description, frequency, color});
    router.dismissTo('/?replace=true');
  }

  return (
    <HabitForm existingName={name} existingDescription={description} existingFrequency={frequency} existingColor={color} onSubmit={onSubmit} />
  )
};
