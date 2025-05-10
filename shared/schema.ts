 // Placeholder per shared/schema.ts

export interface User {
  id: string; // Generalmente l'UID di Firebase
  uid: string; // Spesso usato come sinonimo di id in Firebase
  username: string;
  email: string;
  name?: string;
  level?: string; // Aggiunto da register.tsx
  avatarData?: AvatarData; // Aggiornato per usare l'interfaccia AvatarData
  profileImage?: string; // Aggiunto per profile.tsx, potrebbe essere ridondante con avatarData
  avatarLastUpdated?: string | number; // Aggiunto da profile.tsx, potrebbe essere un timestamp
  firebaseUid?: string; // UID specifico di Firebase Auth, potrebbe coincidere con id
  role?: "user" | "admin"; // Aggiunto per admin/index.tsx
  // Altri campi utente se necessari (es. settings, ecc.)
}

// Interfaccia per i dati dell'avatar, usata in User e AuthResponse
export interface AvatarData {
  url?: string; // URL del modello 3D o immagine avatar
  bodyFatPercentage?: number;
  muscleDefinition?: "low" | "medium" | "high";
  // Altri dati specifici dell'avatar
}

// Interfaccia per le misurazioni corporee, usata in BodyScanHistory e potenzialmente in AvatarData o User
export interface BodyMeasurements {
  weight?: number; // in grammi
  height?: number; // in cm
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  biceps?: number; // in cm
  thighs?: number; // in cm
  // Altre misurazioni se necessarie
}


// Risultato dell'autenticazione, per register.tsx
// Questa interfaccia descrive l'oggetto restituito dalle funzioni di autenticazione
export interface AuthResponse {
  success: boolean;
  user?: User; // L'oggetto utente restituito da Firebase o dal backend
  error?: any; // Oggetto errore da Firebase o messaggio di errore
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  difficulty: string;
  equipment?: string;
  muscleGroups?: string[]; // Array di ID di MuscleGroup
  sets?: number; // Aggiunto per ExerciseCard
  reps?: number; // Aggiunto per ExerciseCard
}

export interface MuscleGroup {
  id: string;
  name: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: number; // in settimane
  imageUrl?: string;
  exercises?: WorkoutExercise[]; 
  frequency?: string; // Aggiunto per program-card.tsx (es. "3 volte/settimana")
}

export interface WorkoutExercise {
  exerciseId: string;
  sets?: number;
  reps?: number;
  duration?: number; // per esercizi a tempo
}

export interface Workout {
  id: string;
  programId?: string;
  name: string;
  // date: string; // o Date - Commentato per ora, dato che placeholderData usa createdAt
  exercises: WorkoutExercise[];
  completed: boolean;
  description?: string; // Aggiunto per TodaysWorkout
  imageUrl?: string; // Aggiunto per TodaysWorkout
  difficulty?: string; // Aggiunto per TodaysWorkout
  duration?: number; // in minuti, Aggiunto per TodaysWorkout
  calories?: number; // Aggiunto per TodaysWorkout
  isTemplate?: boolean; // Aggiunto per TodaysWorkout
  userId?: string | null; // Aggiunto per TodaysWorkout
  createdAt?: string; // ISO date string, Aggiunto per TodaysWorkout
  muscleGroups?: string[]; // Aggiunto per TodaysWorkout
}

export interface AvatarCustomization {
  id: string;
  value: string | number;
  category: string;
}

export interface UserWorkoutProgress {
  id: string;
  userId: string;
  workoutId: string;
  programId?: string;
  completedAt: string; // o Date
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
}

// Interfaccia per la cronologia delle scansioni corporee
export interface BodyScanHistory {
  id: string;
  userId: string;
  scanDate: string | number; // Timestamp o stringa data
  scanSuccess: boolean;
  bodyMeasurements?: BodyMeasurements;
  weight?: number; // in grammi, potrebbe essere ridondante se in bodyMeasurements
  bodyFatPercentage?: number; // in formato XX.YY (es. 18.5)
  musclePercentage?: number; // in formato XX.YY (es. 32.0)
  avatarGeneratedUrl?: string; // URL dell'avatar generato da questa scansione
}

// Interfaccia per la risposta dall'API di generazione avatar da foto
export interface GenerateAvatarFromPhotosResponse {
  success: boolean;
  avatarData?: AvatarData;
  bodyMeasurements?: BodyMeasurements;
  error?: string;
}

// Placeholder per AiSuggestion, da definire meglio se possibile
export interface AiSuggestion {
  id: string;
  title: string;
  description: string;
  type: "workout" | "nutrition" | "motivation";
  // Altri campi specifici per i suggerimenti AI
}

