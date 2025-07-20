interface CheckIn {
  date: string; // Can be ISO or a custom date string (e.g., "4/12/2025")
  status: boolean;
}

interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: number;
  color: string;
  currentStreak?: number;
  checkInMasks: { [key: number]: string };
  sanitisedCheckInMasks?: { [key: number]: string }; // Optional, used for displaying streaks
  createdAt: string;
  updatedAt: string;
}

interface HabitData {
  name: string;
  description: string;
  frequency: number;
  color: string;
  currentStreak?: number;
  sanitisedCheckInMasks?: { [key: number]: string }; // Optional, used for displaying streaks
}

interface Habits { 
  [key: string]: Habit
};
