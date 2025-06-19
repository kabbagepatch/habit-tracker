import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Login from './components/login';
import HabitForm from './components/form';
import { habitService } from '@/service';
import useUserInfo from '@/hooks/useUserInfo';

export default function Create() {
  const router = useRouter();
  const { loading, user } = useUserInfo();

  if (loading) return <Text>Loading...</Text>
  if (!user) return <Login />;

  const onSubmit = async (name: string, description: string, frequency: number, color: string) => {
    await habitService.createHabit({name, description, frequency, color});
    router.dismissTo('/?replace=true');
  }

  return (
    <HabitForm onSubmit={onSubmit} />
  )
};
