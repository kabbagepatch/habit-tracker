import axios from "axios";
import { useEffect, useState } from "react";
import { Button, StatusBar, Text, View } from "react-native";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import firebaseApp from "./firebaseApp";

import { getAuth, initializeAuth, signOut } from 'firebase/auth';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import UserLogin from "./userLogin";

let auth = getAuth(firebaseApp);

export default function Index() {
  const [userEmail, setUserEmail] = useState('')
  const [userHabits, setUserHabits] = useState([])

  const initialise = async () => {
    console.log('initialize');
    if (!auth) {
      console.log('initializeAuth');
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });
    }
    console.log("current user", auth.currentUser);
    if (auth.currentUser?.email) {
      setUserEmail(auth.currentUser.email)
    }
  }

  useEffect(() => {
    initialise()
  }, []);

  const onPressAuth = async () => {
    const auth = getAuth(firebaseApp);
    console.log('sign out')
    await signOut(auth);
    setUserEmail('')
  };

  const onLogin = async (email : string) => {
    setUserEmail(email);
    try {
      const res = await axios.get('http://localhost:8080/habits', { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } });
      setUserHabits(res.data.habits);
    } catch (e : any) {
      console.log(e.status);
    }
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
          <Button title={'Sign out'} onPress={onPressAuth} />
        </>
        :
        <UserLogin onLogin={onLogin} />
      }
    </View>
  );
}
