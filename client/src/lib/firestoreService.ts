import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  // collectionGroup, // Rimosso perché non utilizzato
  writeBatch 
} from "firebase/firestore";
import { db, auth } from "./firebase"; // Assuming db is exported from firebase.ts
import { 
  UserProfile, 
  Exercise, 
  Workout,
  WorkoutExercise, // Assumendo sia utilizzato nelle funzioni dei workout
  // Program, // Rimosso perché non utilizzato nel codice visibile
  // ProgramWorkout, // Rimosso perché non utilizzato nel codice visibile
  UserWorkoutProgress, 
  UserExerciseProgress, 
  MuscleGroup 
  // Import other types as needed
} from "./firestoreTypes"; // Assicurati che questo file esista e esporti i tipi corretti

// --- User Profile Functions ---

const usersCollection = collection(db, "users");

// Create or Update User Profile (using Firebase Auth UID as document ID)
export const setUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<void> => {
  const userDocRef = doc(usersCollection, userId); // Utilizza usersCollection
  // Ensure email and creation timestamp are set correctly
  const dataToSet: Partial<UserProfile> = {
    ...profileData,
    email: profileData.email || auth.currentUser?.email || undefined,
    createdAt: profileData.createdAt || Timestamp.now(), // Assicurati che createdAt sia di tipo Timestamp se UserProfile lo richiede
  };
  await setDoc(userDocRef, dataToSet, { merge: true }); // Use merge:true to update existing or create new
};

// Get User Profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDocRef = doc(usersCollection, userId); // Utilizza usersCollection anche qui per coerenza
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    console.log("No such user profile!");
    return null;
  }
};

// --- Muscle Group Functions ---
const muscleGroupsCollection = collection(db, "muscleGroups");

export const addMuscleGroup = async (groupData: Omit<MuscleGroup, 'id'>): Promise<string> => {
  const docRef = await addDoc(muscleGroupsCollection, groupData);
  return docRef.id;
};

export const getMuscleGroups = async (): Promise<MuscleGroup[]> => {
  const q = query(muscleGroupsCollection);
  const querySnapshot = await getDocs(q);
  const groups: MuscleGroup[] = [];
  querySnapshot.forEach((doc) => {
    groups.push({ id: doc.id, ...doc.data() } as MuscleGroup);
  });
  return groups;
};

// --- Exercise Functions ---

const exercisesCollection = collection(db, "exercises");

// Add Exercise
export const addExercise = async (exerciseData: Omit<Exercise, 'id' | 'createdAt'>): Promise<string> => {
  const dataToAdd = {
    ...exerciseData,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(exercisesCollection, dataToAdd);
  return docRef.id;
};

// Get All Exercises
export const getAllExercises = async (): Promise<Exercise[]> => {
  const q = query(exercisesCollection);
  const querySnapshot = await getDocs(q);
  const exercises: Exercise[] = [];
  querySnapshot.forEach((doc) => {
    exercises.push({ id: doc.id, ...doc.data() } as Exercise);
  });
  return exercises;
};

// Get Exercise by ID
export const getExerciseById = async (exerciseId: string): Promise<Exercise | null> => {
  const exerciseDocRef = doc(exercisesCollection, exerciseId);
  const docSnap = await getDoc(exerciseDocRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Exercise;
  } else {
    console.log("No such exercise!");
    return null;
  }
};

// Update Exercise
export const updateExercise = async (exerciseId: string, updateData: Partial<Exercise>): Promise<void> => {
  const exerciseDocRef = doc(exercisesCollection, exerciseId);
  await updateDoc(exerciseDocRef, updateData);
};

// Delete Exercise
export const deleteExercise = async (exerciseId: string): Promise<void> => {
  const exerciseDocRef = doc(exercisesCollection, exerciseId);
  await deleteDoc(exerciseDocRef);
};

// --- Workout Functions ---

const workoutsCollection = collection(db, "workouts");

// Add Workout (Template or User-specific)
export const addWorkout = async (workoutData: Omit<Workout, 'id' | 'createdAt'>, workoutExercisesData: Omit<WorkoutExercise, 'id'>[]): Promise<string> => {
  const batch = writeBatch(db);
  
  const workoutDocRef = doc(workoutsCollection); 
  const dataToAdd = {
    ...workoutData,
    userId: workoutData.isTemplate ? null : auth.currentUser?.uid, 
    createdAt: Timestamp.now(),
  };
  batch.set(workoutDocRef, dataToAdd);

  const exercisesSubcollection = collection(workoutDocRef, "workoutExercises");
  workoutExercisesData.forEach(exercise => {
    const exerciseDocRef = doc(exercisesSubcollection);
    batch.set(exerciseDocRef, exercise);
  });

  await batch.commit();
  return workoutDocRef.id;
};

// Get Workout with Exercises
export const getWorkoutWithExercises = async (workoutId: string): Promise<{ workout: Workout; exercises: WorkoutExercise[] } | null> => {
  const workoutDocRef = doc(workoutsCollection, workoutId);
  const workoutSnap = await getDoc(workoutDocRef);

  if (!workoutSnap.exists()) {
    console.log("No such workout!");
    return null;
  }

  const workoutData = { id: workoutSnap.id, ...workoutSnap.data() } as Workout;

  const exercisesSubcollection = collection(workoutDocRef, "workoutExercises");
  const exercisesQuery = query(exercisesSubcollection); 
  const exercisesSnapshot = await getDocs(exercisesQuery);
  
  const exercises: WorkoutExercise[] = [];
  exercisesSnapshot.forEach((doc) => {
    exercises.push({ id: doc.id, ...doc.data() } as WorkoutExercise);
  });

  return { workout: workoutData, exercises: exercises };
};

// Get All Workout Templates
export const getWorkoutTemplates = async (): Promise<Workout[]> => {
  const q = query(workoutsCollection, where("isTemplate", "==", true));
  const querySnapshot = await getDocs(q);
  const workouts: Workout[] = [];
  querySnapshot.forEach((doc) => {
    workouts.push({ id: doc.id, ...doc.data() } as Workout);
  });
  return workouts;
};

// Get User's Workouts
export const getUserWorkouts = async (userId: string): Promise<Workout[]> => {
  const q = query(workoutsCollection, where("userId", "==", userId), where("isTemplate", "==", false));
  const querySnapshot = await getDocs(q);
  const workouts: Workout[] = [];
  querySnapshot.forEach((doc) => {
    workouts.push({ id: doc.id, ...doc.data() } as Workout);
  });
  return workouts;
};

// --- Add more functions for Programs, Progress, etc. as needed ---

// Example: Add User Workout Progress
export const addUserWorkoutProgress = async (progressData: Omit<UserWorkoutProgress, 'id' | 'completedAt'>, exerciseProgressData: Omit<UserExerciseProgress, 'id'>[]): Promise<string> => {
  const batch = writeBatch(db);
  const progressCollection = collection(db, "userWorkoutProgress");
  const progressDocRef = doc(progressCollection);

  const dataToAdd = {
    ...progressData,
    userId: auth.currentUser?.uid, 
    completedAt: Timestamp.now(),
  };
  batch.set(progressDocRef, dataToAdd);

  const exercisesSubcollection = collection(progressDocRef, "userExerciseProgress");
  exerciseProgressData.forEach(exercise => {
    const exerciseDocRef = doc(exercisesSubcollection);
    batch.set(exerciseDocRef, exercise);
  });

  await batch.commit();
  return progressDocRef.id;
};

