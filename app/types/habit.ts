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
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string;
  checkIns: CheckIn[];
  createdAt: string;
  updatedAt: string;
}
