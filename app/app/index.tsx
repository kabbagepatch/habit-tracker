import axios from "axios";
import { useEffect, useState } from "react";
import { StatusBar, Text, View, FlatList, TouchableOpacity } from "react-native";
import { FAB, Checkbox, IconButton } from 'react-native-paper';
import { onAuthStateChanged } from "firebase/auth";

import Login from "./components/login";
import { firebaseAuth } from "./firebaseApp";
let auth = firebaseAuth;

export default function Index() {
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState(auth.currentUser?.email || '')
  const [userHabits, setUserHabits] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setUserEmail(user?.email || '');
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

  const isCheckedToday = (habit : any) => {
    const dateString = new Date().toLocaleDateString();
    const checkInInd = habit.checkIns.findIndex((checkIn : any) => checkIn.date == dateString);
    if (checkInInd === -1) {
      return false
    } else {
      return habit.checkIns[checkInInd].status;
    }
  }

  const onCheck = async (habitInd : number) => {
    const dateString = new Date().toLocaleDateString();

    const habit : any = userHabits[habitInd];

    const res = await axios.post(
      `http://localhost:8080/habits/${habit.id}/check-in`,
      { date: dateString, status: !isCheckedToday(habit) },
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` }
    });
    console.log('Success: ', res.data.habit.checkIns);

    userHabits[habitInd].checkIns = res.data.habit.checkIns;
    setUserHabits([].concat(userHabits));
  }

  const onDelete = async (habitInd : number) => {
    const habit : any = userHabits[habitInd];
    const res = await axios.delete(
      `http://localhost:8080/habits/${habit.id}`,
      { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` }
    });
    console.log('Success: ', res.data);

    userHabits.splice(habitInd, 1);
    setUserHabits([].concat(userHabits));
  }

  useEffect(() => {
    if (userEmail) setHabits()
    // @ts-ignore
  }, [userEmail]);

  if (loading) return <Text>Loading...</Text>
  if (!userEmail) return <Login />;

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
    }}>
      <StatusBar />
      <View style={{ width: '100%', flex: 1, padding: 20 }}> 
        <FlatList
          data={userHabits}
          keyExtractor={(item : any) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => onCheck(index)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                  <Checkbox status={isCheckedToday(item) ? 'checked' : 'unchecked'} color='#BB86FC' />
                  <Text style={{ fontSize: 18 }}>{item.name}</Text>
                </View>
              </TouchableOpacity>
              <IconButton icon='delete' iconColor='#F00A' onPress={() => onDelete(index)} />
            </View>
          )}
        />
        <FAB
          style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#BB86FC' }}
          icon='plus'
        />
      </View>
    </View>
  );
}
