import axios from 'axios';

import { firebaseAuth } from '../app/firebaseApp';
let auth = firebaseAuth;

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:8080';

export const getHabits = async () : Promise<{ [key: string]: Habit } | undefined> => {
  try {
    const res = await axios.get(
      `${baseUrl}/habits`,
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
    );
    return res.data;
  } catch (e : any) {
    console.log(e.status);
  }
}

export const getHabit = async (habitId : string) : Promise<Habit | undefined> => {
  try {
    const res = await axios.get(
      `${baseUrl}/habits/${habitId}`,
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
    );
    return res.data.habit;
  } catch (e : any) {
    console.log(e.status);
  }
}

export const createHabit = async (habitData : HabitData) : Promise<Habit | undefined> => {
  try {
    const res = await axios.post(
      `${baseUrl}/habits`,
      habitData,
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
    );
    return res.data.habit;
  } catch (e : any) {
    console.log(e.status);
  }
}

export const updateHabit = async (habitId : string, habitData : HabitData) : Promise<Habit | undefined> => {
  try {
    const res = await axios.put(
      `${baseUrl}/habits/${habitId}`,
      habitData,
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
    );
    return res.data.habit;
  } catch (e : any) {
    console.log(e.status);
  }
}

export const deleteHabit = async (habitId : string) : Promise<Habit | undefined> => {
  try {
    const res = await axios.delete(
      `${baseUrl}/habits/${habitId}`,
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
    );
    return res.data.habit;
  } catch (e : any) {
    console.log(e.status);
  }
}

export const checkIn = async (habitId : string, date : string, status : boolean) : Promise<Habit | undefined> => {
  try {
    const res = await axios.post(
      `${baseUrl}/habits/${habitId}/check-in`,
      { date, status },
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
    );
    return res.data.habit;
  } catch (e : any) {
    console.log(e.status);
  }
}
