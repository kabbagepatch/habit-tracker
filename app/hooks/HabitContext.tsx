import { createContext, useState } from "react";

interface HabitContext {
  allHabits: Habits;
  setHabit?: (habit: Habit) => void;
  updateHabit?: (id: string, updatedHabit: HabitData) => void;
  deleteHabit?: (id: string) => void;
  setAllHabits: React.Dispatch<React.SetStateAction<Habits>>;
}

export const HabitsContext = createContext<HabitContext>({allHabits: {}, setAllHabits: () => {} });

export const HabitsProvider = ({ children }: { children: React.ReactNode }) => {
  const [allHabits, setAllHabits] = useState<Habits>({});

  const setHabit = (habit: Habit) => {
    setAllHabits(prev => ({ ...prev, [habit.id]: habit }));
  };

  const updateHabit = (id: string, updatedHabit: HabitData) => {
    setAllHabits(prev => ({ ...prev, [id]: { ...prev[id], ...updatedHabit } }));
  };

  const deleteHabit = (id: string) => {
    setAllHabits(prev => {
      const newHabits = { ...prev };
      delete newHabits[id];
      return newHabits;
    });
  };

  return (
    <HabitsContext.Provider value={{allHabits, setHabit, updateHabit, deleteHabit, setAllHabits}}>
      {children}
    </HabitsContext.Provider>
  )
};
