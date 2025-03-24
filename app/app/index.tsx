import axios from "axios";
import { useEffect, useState } from "react";
import { Button, StatusBar, Text, View } from "react-native";
import { firebaseAuth } from "./firebaseApp";
import { signOut, onAuthStateChanged } from 'firebase/auth';
import UserLogin from "./userLogin";

let auth = firebaseAuth;

export default function Index() {
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userHabits, setUserHabits] = useState([])

  const initialise = async () => {
    console.log('initialize');
    if (!auth) {
      console.log('initializeAuth');
      auth = firebaseAuth
    }
    if (auth.currentUser?.email) {
      setUserEmail(auth.currentUser.email)
    }
  }

  useEffect(() => {
    initialise()
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email)
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setHabits = async () => {
    try {
      const res = await axios.get('http://localhost:8080/habits', { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } });
      setUserHabits(res.data.habits);
    } catch (e : any) {
      console.log(e.status);
    }
  }

  useEffect(() => {
    if (userEmail) setHabits()
  }, [userEmail]);

  const onSignOut = async () => {
    console.log('sign out')
    await signOut(auth);
    setUserEmail('');
    setUserHabits([]);
  };

  const onLogin = async (email : string) => {
    setUserEmail(email);
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 150,
        alignItems: "center",
      }}
    >
      <StatusBar />
      {userEmail ?
        <>
          <Text style={{ marginBottom: 20 }}>Currently logged in as: {userEmail}.</Text>
          <Text style={{ marginBottom: 20 }}>Habits: {userHabits.map((h : any) => h.name).join(', ')}</Text>
          <Button title={'Sign out'} onPress={onSignOut} />
        </>
        :
        loading ? 'Loading...' : <UserLogin onLogin={onLogin} />
      }
    </View>
  );
}
