import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@shared/schema";

export interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  weeklyProgress: number;
  stats: {
    calories: number;
    activeMinutes: number;
    workouts: number;
    exercises: number;
  };
  notifications: Notification[];
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  weeklyProgress: 75, // Example progress percentage
  stats: {
    calories: 420,
    activeMinutes: 45,
    workouts: 12,
    exercises: 48,
  },
  notifications: [
    { id: 1, text: "Nuovo allenamento disponibile", time: "10m fa", read: false },
    { id: 2, text: "Complimenti! Hai raggiunto il tuo obiettivo settimanale", time: "2h fa", read: false },
    { id: 3, text: "Ricordati di registrare i tuoi progressi", time: "1g fa", read: false },
  ],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateWeeklyProgress: (state, action: PayloadAction<number>) => {
      state.weeklyProgress = action.payload;
    },
    updateStats: (state, action: PayloadAction<Partial<UserState["stats"]>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "read">>) => {
      const newId = state.notifications.length > 0 
        ? Math.max(...state.notifications.map(n => n.id)) + 1
        : 1;
      
      state.notifications.unshift({
        id: newId,
        ...action.payload,
        read: false,
      });
    },
    markNotificationAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const {
  setUser,
  clearUser,
  updateWeeklyProgress,
  updateStats,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
} = userSlice.actions;

export default userSlice.reducer;
