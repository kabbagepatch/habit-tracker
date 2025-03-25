import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { TextInput, Button } from 'react-native-paper';
import { onAuthStateChanged } from "firebase/auth";

import { firebaseAuth } from "./firebaseApp";
import Login from "./components/login";
let auth = firebaseAuth;

export default function Create() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(auth.currentUser)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState(7);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

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
    try {
      const res = await axios.post(
        'http://localhost:8080/habits',
        { name, description, frequency },
        { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` }
      });
      console.log('Success: ', res.data);
    } catch (e : any) {
      console.log(e.status);
    }
  }

  return (
    <View style={{ padding: 20, width: '100%' }}>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode='outlined'
        placeholder='Ex: Reading'
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode='outlined'
        placeholder='Ex: Read books or listen to audiobooks'
      />
      <TextInput
        label="Frequency (per week)"
        value={frequency == 0 ? '' : frequency.toString()}
        onChangeText={setNumericFrequency}
        mode='outlined'
        placeholder='Set a number between 1 and 7'
      />
      <Button mode='contained' uppercase onPress={onSave}>
        Save
      </Button>
    </View>
  )
}