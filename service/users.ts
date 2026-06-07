import axios from 'axios';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

import firebaseApp from '@/firebaseApp';

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:8080';

export const signUp = async (email : string, password : string, name : string) => {
  const auth = getAuth(firebaseApp);
  const userCred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(userCred.user, { displayName: name })
  await axios.post(
    `${baseUrl}/users`,
    undefined,
    { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
  );
}

export const signIn = async (email : string, password : string) => {
  const auth = getAuth(firebaseApp);
  await signInWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  const auth = getAuth(firebaseApp);
  await auth.signOut();
}
