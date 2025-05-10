import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workout, WorkoutExercise, Program } from "@shared/schema";

interface WorkoutsState {
  workouts: Workout[];
  programs: Program[];
  selectedWorkout: Workout | null;
  selectedProgram: Program | null;
  workoutExercises: WorkoutExercise[];
  loading: boolean;
  error: string | null;
  activeWorkout: {
    workout: Workout | null;
    currentExerciseIndex: number;
    isActive: boolean;
    startTime: number | null;
    completed: boolean;
  };
}

const initialState: WorkoutsState = {
  workouts: [],
  programs: [],
  selectedWorkout: null,
  selectedProgram: null,
  workoutExercises: [],
  loading: false,
  error: null,
  activeWorkout: {
    workout: null,
    currentExerciseIndex: 0,
    isActive: false,
    startTime: null,
    completed: false,
  },
};

export const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    setWorkouts: (state, action: PayloadAction<Workout[]>) => {
      state.workouts = action.payload;
    },
    setPrograms: (state, action: PayloadAction<Program[]>) => {
      state.programs = action.payload;
    },
    setSelectedWorkout: (state, action: PayloadAction<Workout | null>) => {
      state.selectedWorkout = action.payload;
    },
    setSelectedProgram: (state, action: PayloadAction<Program | null>) => {
      state.selectedProgram = action.payload;
    },
    setWorkoutExercises: (state, action: PayloadAction<WorkoutExercise[]>) => {
      state.workoutExercises = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    startWorkout: (state, action: PayloadAction<Workout>) => {
      state.activeWorkout = {
        workout: action.payload,
        currentExerciseIndex: 0,
        isActive: true,
        startTime: Date.now(),
        completed: false,
      };
    },
    nextExercise: (state) => {
      if (state.activeWorkout.isActive && state.activeWorkout.workout && state.activeWorkout.currentExerciseIndex < state.activeWorkout.workout.exercises.length - 1) {
        state.activeWorkout.currentExerciseIndex += 1;
      }
    },
    previousExercise: (state) => {
      if (state.activeWorkout.isActive && state.activeWorkout.currentExerciseIndex > 0) {
        state.activeWorkout.currentExerciseIndex -= 1;
      }
    },
    completeWorkout: (state) => {
      if (state.activeWorkout.isActive) {
        state.activeWorkout.completed = true;
        state.activeWorkout.isActive = false;
        // Potrebbe essere utile resettare startTime o aggiungere endTime
      }
    },
    cancelWorkout: (state) => {
      state.activeWorkout = initialState.activeWorkout;
    },
    addWorkout: (state, action: PayloadAction<Workout>) => {
      state.workouts.push(action.payload);
    },
    updateWorkout: (state, action: PayloadAction<Workout>) => {
      const index = state.workouts.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workouts[index] = action.payload;
      }
    },
    removeWorkout: (state, action: PayloadAction<string>) => { // Cambiato action.payload a string
      state.workouts = state.workouts.filter(w => w.id !== action.payload);
    },
    addProgram: (state, action: PayloadAction<Program>) => {
      state.programs.push(action.payload);
    },
    updateProgram: (state, action: PayloadAction<Program>) => {
      const index = state.programs.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.programs[index] = action.payload;
      }
    },
    removeProgram: (state, action: PayloadAction<string>) => { // Cambiato action.payload a string
      state.programs = state.programs.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  setWorkouts,
  setPrograms,
  setSelectedWorkout,
  setSelectedProgram,
  setWorkoutExercises,
  setLoading,
  setError,
  startWorkout,
  nextExercise,
  previousExercise,
  completeWorkout,
  cancelWorkout,
  addWorkout,
  updateWorkout,
  removeWorkout,
  addProgram,
  updateProgram,
  removeProgram,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;

