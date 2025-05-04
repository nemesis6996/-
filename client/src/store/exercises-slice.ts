import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, MuscleGroup } from "@shared/schema";

interface ExercisesState {
  exercises: Exercise[];
  muscleGroups: MuscleGroup[];
  selectedExercise: Exercise | null;
  selectedMuscleGroup: MuscleGroup | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchQuery: string;
    muscleGroupId: number | null;
    difficulty: string | null;
    equipment: string | null;
  };
}

const initialState: ExercisesState = {
  exercises: [],
  muscleGroups: [],
  selectedExercise: null,
  selectedMuscleGroup: null,
  loading: false,
  error: null,
  filters: {
    searchQuery: "",
    muscleGroupId: null,
    difficulty: null,
    equipment: null,
  },
};

export const exercisesSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.exercises = action.payload;
    },
    setMuscleGroups: (state, action: PayloadAction<MuscleGroup[]>) => {
      state.muscleGroups = action.payload;
    },
    setSelectedExercise: (state, action: PayloadAction<Exercise | null>) => {
      state.selectedExercise = action.payload;
    },
    setSelectedMuscleGroup: (state, action: PayloadAction<MuscleGroup | null>) => {
      state.selectedMuscleGroup = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ExercisesState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    addExercise: (state, action: PayloadAction<Exercise>) => {
      state.exercises.push(action.payload);
    },
    updateExercise: (state, action: PayloadAction<Exercise>) => {
      const index = state.exercises.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.exercises[index] = action.payload;
      }
    },
    removeExercise: (state, action: PayloadAction<number>) => {
      state.exercises = state.exercises.filter(e => e.id !== action.payload);
    },
  },
});

export const {
  setExercises,
  setMuscleGroups,
  setSelectedExercise,
  setSelectedMuscleGroup,
  setLoading,
  setError,
  setFilters,
  resetFilters,
  addExercise,
  updateExercise,
  removeExercise,
} = exercisesSlice.actions;

export default exercisesSlice.reducer;
