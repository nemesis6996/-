export interface AiSuggestion {
  suggestions?: string[];
  // Aggiungi altre proprietà necessarie per AiSuggestion
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroups?: string[];
  difficulty?: string;
  equipment?: string;
  videoUrl?: string;
  imageUrl?: string; // Aggiunto per coerenza con ExerciseCard
  // Aggiungi altre proprietà necessarie per Exercise
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  duration?: string; // es. "4 settimane"
  frequency?: string; // es. "3 volte a settimana"
  exercises?: Exercise[];
  imageUrl?: string; // Aggiunto per coerenza con ProgramCard
  // Aggiungi altre proprietà necessarie per Program
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  name?: string | null; // Aggiunto per coerenza con ProfilePreview
  username?: string | null; // Aggiunto per coerenza con ProfilePreview
  profileImage?: string | null; // Aggiunto per coerenza con ProfilePreview
  photoURL?: string | null;
  weeklyProgress?: number; // Aggiunto per GoalProgress
  // Aggiungi altre proprietà specifiche dell'app
  weight?: number;
  height?: number;
  goals?: string[];
}

export interface Workout {
  id: string; // Mantenuto come stringa per coerenza, anche se usato come numero in un queryKey
  name: string;
  description?: string;
  imageUrl?: string;
  difficulty?: string;
  duration?: number; // in minuti
  calories?: number;
  isTemplate?: boolean;
  userId?: string | null;
  createdAt?: Date | string; // Permette stringa o Date
  date?: string | Date; // Già presente, ma per coerenza con createdAt
  exercises?: Array<{ exerciseId: string; sets?: number; reps?: number; weight?: number; notes?: string }>;
  programId?: string;
  // Aggiungi altre proprietà
}

export interface AvatarCustomization {
    id: string;
    name: string;
    category: string; // es. 'hair', 'outfit', 'accessory'
    assetUrl: string; // URL al modello 3D o texture
    thumbnailUrl?: string;
    previewUrl?: string; // Aggiunto per ProfilePreview
    isPrimary?: boolean; // Aggiunto per ProfilePreview
}

export interface BodyMeasurements {
    height?: number; // cm
    weight?: number; // kg
    chest?: number; // cm
    waist?: number; // cm
    hips?: number; // cm
    armL?: number; // cm
    armR?: number; // cm
    legL?: number; // cm
    legR?: number; // cm
    // ...altre misurazioni
}

export interface AvatarData {
    modelUrl: string; // URL al modello 3D base dell'avatar
    textureUrl?: string;
    customizations?: AvatarCustomization[];
    bodyMeasurements?: BodyMeasurements;
}

// Puoi aggiungere altre interfacce o tipi condivisi qui

