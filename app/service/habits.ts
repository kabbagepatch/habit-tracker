import axios from 'axios';

import { firebaseAuth } from '../app/firebaseApp';
let auth = firebaseAuth;

const baseUrl = 'https://habitsapi-426700.uc.r.appspot.com'

export const getHabits = async () : Promise<Habit[] | undefined> => {
  try {
    const res = await axios.get(
      `${baseUrl}/habits`,
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
    );
    return res.data.habits;
  } catch (e : any) {
    console.log(e.status);
  }
}

export const createHabit = async (name : string, description : string, frequency : number, color: string) : Promise<Habit | undefined> => {
  try {
    const res = await axios.post(
      `${baseUrl}/habits`,
      { name, description, frequency, color },
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
