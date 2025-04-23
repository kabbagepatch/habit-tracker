import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

import Login from './components/login';
import { habitService } from '@/service';
import useUserInfo from '@/hooks/useUserInfo';

export default function Create() {
  const router = useRouter();
  const { loading, user } = useUserInfo();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState(7);
  const [error, setError] = useState('');

  if (loading) return <Text>Loading...</Text>
  if (!user) return <Login />;

  const setNumericFrequency = (f : string) => {
    if (!f) setFrequency(0);
    if (!Number.isNaN(f)) {
      const fInt = parseInt(f);
      if (fInt >= 1 && fInt <= 7) {
        setFrequency(fInt);
      }
    }
  }

  const onSave = async () => {
    if (!name) {
      setError('Name is required');
      return;
    }

    await habitService.createHabit(name, description, frequency);
    router.dismissTo('/?replace=true');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new habit</Text>
      <Text style={styles.description}>Fill in the details below:</Text>
      <TextInput
        label='Name'
        value={name}
        onChangeText={setName}
        mode='outlined'
        placeholder='Ex: Reading'
        style={styles.input}
      />
      <TextInput
        label='Description'
        value={description}
        onChangeText={setDescription}
        mode='outlined'
        placeholder='Ex: Read books or listen to audiobooks'
        style={styles.input}
      />
      <TextInput
        label='Frequency (per week)'
        value={frequency == 0 ? '' : frequency.toString()}
        onChangeText={setNumericFrequency}
        mode='outlined'
        placeholder='Set a number between 1 and 7'
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button style={styles.button} mode='contained' uppercase onPress={onSave}>
        Save
      </Button>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
});
