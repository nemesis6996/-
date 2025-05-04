import { Timestamp } from "firebase/firestore";

// Firestore uses string IDs automatically

// Corresponds to 'users' table
export interface UserProfile {
  // id: string; // Firestore document ID will be the Firebase Auth UID
  username: string;
  email: string; // Should match Firebase Auth email
  name: string;
  level?: string; // Default: 'Principiante'
  profileImage?: string;
  avatarData?: Record<string, any>; // JSONB equivalent
  avatarLastUpdated?: Timestamp;
  bodyMeasurements?: Record<string, any>; // JSONB equivalent
  createdAt?: Timestamp;
  role?: 'user' | 'admin'; // Default: 'user'
}

// Corresponds to 'muscle_groups' table
export interface MuscleGroup {
  id?: string; // Firestore document ID
  name: string;
}

// Corresponds to 'exercises' table
export interface Exercise {
  id?: string; // Firestore document ID
  name: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzato';
  instructions: string;
  muscleGroupId: string; // Reference to MuscleGroup document ID
  muscleGroupName?: string; // Denormalized for easier display
  equipment: string;
  createdAt?: Timestamp;
}

// Corresponds to 'workouts' table
export interface Workout {
  id?: string; // Firestore document ID
  name: string;
  description: string;
  imageUrl?: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzato';
  duration: number; // in minutes
  calories: number;
  isTemplate: boolean; // Default: false
  createdAt?: Timestamp;
  userId?: string | null; // Reference to UserProfile document ID (Firebase Auth UID), null for system templates
  // workoutExercises will be a subcollection
}

// Corresponds to 'workout_exercises' table (as subcollection of Workout)
export interface WorkoutExercise {
  id?: string; // Firestore document ID
  // workoutId: string; // Parent document ID
  exerciseId: string; // Reference to Exercise document ID
  exerciseName?: string; // Denormalized
  sets: number;
  reps: number;
  restTime: number; // in seconds
  order: number;
}

// Corresponds to 'programs' table
export interface Program {
  id?: string; // Firestore document ID
  name: string;
  description: string;
  imageUrl?: string;
  duration: number; // in weeks
  frequency: number; // workouts per week
  difficulty: 'principiante' | 'intermedio' | 'avanzato';
  isTemplate: boolean; // Default: false
  createdAt?: Timestamp;
  userId?: string | null; // Reference to UserProfile document ID (Firebase Auth UID), null for system templates
  // programWorkouts will be a subcollection or array of refs
}

// Corresponds to 'program_workouts' table (as subcollection of Program)
export interface ProgramWorkout {
  id?: string; // Firestore document ID
  // programId: string; // Parent document ID
  workoutId: string; // Reference to Workout document ID
  workoutName?: string; // Denormalized
  weekNumber: number;
  dayNumber: number;
}

// Corresponds to 'user_workout_progress' table
export interface UserWorkoutProgress {
  id?: string; // Firestore document ID
  userId: string; // Reference to UserProfile document ID (Firebase Auth UID)
  workoutId: string; // Reference to Workout document ID
  workoutName?: string; // Denormalized
  completedAt?: Timestamp;
  durationMinutes: number;
  caloriesBurned: number;
  feedback?: string;
  rating?: number; // e.g., 1-5
  // userExerciseProgress will be a subcollection
}

// Corresponds to 'user_exercise_progress' table (as subcollection of UserWorkoutProgress)
export interface UserExerciseProgress {
  id?: string; // Firestore document ID
  // userId: string; // Inherited from parent
  // workoutProgressId: string; // Parent document ID
  exerciseId: string; // Reference to Exercise document ID
  exerciseName?: string; // Denormalized
  sets: number;
  reps: number;
  weight?: number;
  // completedAt?: Timestamp; // Inherited from parent?
}

// Corresponds to 'ai_assistant_logs' table
export interface AiAssistantLog {
  id?: string; // Firestore document ID
  userId: string; // Reference to UserProfile document ID (Firebase Auth UID)
  query: string;
  response: string;
  timestamp?: Timestamp;
}

// Corresponds to 'ai_suggestions' table
export interface AiSuggestion {
  id?: string; // Firestore document ID
  userId: string; // Reference to UserProfile document ID (Firebase Auth UID)
  suggestions: Record<string, any>; // JSONB equivalent
  createdAt?: Timestamp;
}

// Corresponds to 'admin_notifications' table
export interface AdminNotification {
  id?: string; // Firestore document ID
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  targetUserId?: string | null; // Reference to UserProfile document ID (Firebase Auth UID), null for all users
  isRead?: boolean; // Default: false
  expiresAt?: Timestamp;
  createdAt?: Timestamp;
  createdBy?: string; // Admin User ID
}

// Corresponds to 'body_scan_history' table
export interface BodyScanHistory {
  id?: string; // Firestore document ID
  userId: string; // Reference to UserProfile document ID (Firebase Auth UID)
  bodyMeasurements: Record<string, any>; // JSONB equivalent
  notes?: string;
  weight?: number; // Weight in grams
  bodyFatPercentage?: number; // e.g., 15.5 for 15.5%
  musclePercentage?: number; // e.g., 40.2 for 40.2%
  scanDate?: Timestamp;
  createdAt?: Timestamp;
}

// Corresponds to 'avatar_customization' table
export interface AvatarCustomization {
  id?: string; // Firestore document ID
  userId: string; // Reference to UserProfile document ID (Firebase Auth UID)
  avatarData: Record<string, any>; // JSONB equivalent
  name: string;
  isActive?: boolean; // Default: true
  createdAt?: Timestamp;
}

