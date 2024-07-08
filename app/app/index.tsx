import { useEffect, useState } from "react";
import { Button, StatusBar, Text, View } from "react-native";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import firebaseApp from "./firebaseApp";

import { getAuth, initializeAuth, signOut } from 'firebase/auth';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import UserLogin from "./userLogin";


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
          <Button title={'Sign out'} onPress={onPressAuth} />
        </>
        :
        <UserLogin onLogin={setUserEmail} />
      }
    </View>
  );
}
