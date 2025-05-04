import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import exercisesReducer from "./exercises-slice";
import workoutsReducer from "./workouts-slice";
import avatarReducer from "./avatar-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    exercises: exercisesReducer,
    workouts: workoutsReducer,
    avatar: avatarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
