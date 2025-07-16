import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';

type FormProps = {
  existingHabit?: Habit;
  submitting?: boolean;
  onSubmit: (name: string, description: string, frequency: number, color: string) => void;
};

export default function Form({ existingHabit, submitting, onSubmit } : FormProps) {
  const [name, setName] = useState(existingHabit?.name || '');
  const [description, setDescription] = useState(existingHabit?.description || '');
  const [frequency, setFrequency] = useState(existingHabit?.frequency || 7);
  const [color, setColor] = useState(existingHabit?.color || 'hsl(0, 100%, 71%)');
  const [error, setError] = useState('');

  const { colors } = useTheme();

  const habitColors = [
    'hsla(0, 100%, 71%, 1)', // coral
    'hsla(176, 56%, 55%, 1)', // turquoise
    'hsla(191, 60%, 55%, 1)', // sky blue
    'hsla(152, 36%, 70%, 1)', // sage
    'hsla(48, 100%, 84%, 1)', // cream
    'hsla(0, 35%, 74%, 1)', // dusty rose
  ];

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
      setTimeout(() => setError(''), 3000);
      return;
    }

    onSubmit(name, description, frequency, color);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.form, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Create a new habit</Text>
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
          {habitColors.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorOption,
                { backgroundColor: c },
                color === c && styles.color
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button style={[styles.saveButton, { backgroundColor: color }]} mode='contained' onPress={onSave} loading={submitting} disabled={submitting}>
          <Text style={[styles.saveButtonText, { color: colors.text }]}>{existingHabit ? 'Update' : 'Add'} Habit</Text>
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
    padding: 15,
    borderRadius: 10,
    margin: '1%',
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
  color: {
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
