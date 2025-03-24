import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: 'habitsapi-426700.firebaseapp.com',
  projectId: 'habitsapi-426700',
  storageBucket: 'habitsapi-426700.appspot.com',
  messagingSenderId: '472591136365',
  appId: '1:472591136365:web:6129ffd560b9c66e7cf164',
  measurementId: 'G-TF2VLVQTLR'
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth() || initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default firebaseApp;
