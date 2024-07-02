import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

const firebaseConfig = {
  apiKey: '',
  authDomain: 'habitsapi-426700.firebaseapp.com',
  projectId: 'habitsapi-426700',
  storageBucket: 'habitsapi-426700.appspot.com',
  messagingSenderId: '472591136365',
  appId: '1:472591136365:web:6129ffd560b9c66e7cf164',
  measurementId: 'G-TF2VLVQTLR'
};

const firebaseApp = initializeApp(firebaseConfig);

export default function Index() {
  const [userEmail, setUserEmail] = useState('')

  const initialise = async () => {
    console.log('initialize');
    let auth = getAuth(firebaseApp);
    if (!auth) {
      console.log('initializeAuth');
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });
    }
    console.log(auth.currentUser);
    // if (!auth.currentUser) {
    //   // await createUserWithEmailAndPassword(auth, "kavishmunjal123@gmail.com", "#TestPass13")
    //   await signInWithEmailAndPassword(auth, "kavishmunjal123@gmail.com", "#TestPass13")
    //   console.log(auth.currentUser);
    // }
    // setUserEmail(auth.currentUser?.email || '')
  }

  useEffect(() => {
    initialise()
  }, []);

  const onPressAuth = async () => {
    const auth = getAuth(firebaseApp);
    console.log(auth.currentUser);
    if (auth.currentUser) {
      console.log('sign out')
      await signOut(auth);
      console.log(auth.currentUser);
    } else {
      console.log('sign in')
      await signInWithEmailAndPassword(auth, "kavishmunjal123@gmail.com", "#TestPass13")
      console.log(auth.currentUser);
    }

    setUserEmail(auth.currentUser?.email || '')
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen. {userEmail}.</Text>
      <Button title={userEmail ? 'Sign out' : 'Sign In'} color="#841584" onPress={onPressAuth} />
    </View>
  );
}
