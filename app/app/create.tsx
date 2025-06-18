import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [selectedColor, setSelectedColor] = useState('hsl(0, 100%, 71%)');
  const [error, setError] = useState('');

  const colors = [
    'hsla(0, 100%, 71%, 1)', // coral
    'hsla(176, 56%, 55%, 1)', // turquoise
    'hsla(191, 60%, 55%, 1)', // sky blue
    'hsla(152, 36%, 70%, 1)', // sage
    'hsla(48, 100%, 84%, 1)', // cream
    'hsla(0, 35%, 74%, 1)', // dusty rose
  ];

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

    await habitService.createHabit(name, description, frequency, selectedColor);
    router.dismissTo('/?replace=true');
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create a new habit</Text>
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
        <View style={styles.colorPicker}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button style={[styles.saveButton, { backgroundColor: selectedColor }]} mode='contained' onPress={onSave}>
          <Text style={styles.saveButtonText}>Add Habit</Text>
        </Button>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  form: {
    width: '90%',
    minWidth: 300,
    maxHeight: 400,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    margin: 15,
    shadowColor: 'hsl(0, 0%, 0%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: 'hsl(0, 0%, 20%)',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 5,
    width: '100%',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
