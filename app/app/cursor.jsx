import { useEffect, useState } from 'react';
import { TextInput, Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FAB, Checkbox, IconButton } from 'react-native-paper';

const CreateHabitForm = ({ onSubmit }) => {
  const [habitName, setHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');

  const colors = [
    '#FF6B6B', // coral
    '#4ECDC4', // turquoise
    '#45B7D1', // sky blue
    '#96CEB4', // sage
    '#FFEEAD', // cream
    '#D4A5A5', // dusty rose
  ];

  const handleSubmit = () => {
    if (habitName.trim()) {
      onSubmit({
        name: habitName,
        color: selectedColor,
        completed: [false, false, false, false, false, false, false]
      });
      setHabitName('');
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Habit name"
        value={habitName}
        onChangeText={setHabitName}
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
      <TouchableOpacity 
        style={[styles.submitButton, { backgroundColor: selectedColor }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Add Habit</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add these styles to your StyleSheet
const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },
  submitButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateHabitForm;
