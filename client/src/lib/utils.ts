import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert minutes to hours and minutes format
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
}

// Format a date to a readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

// Get difficulty label and color
export function getDifficultyInfo(difficulty: string): { label: string, color: string } {
  switch (difficulty.toLowerCase()) {
    case 'principiante':
      return { 
        label: 'Principiante',
        color: 'bg-green-100 text-green-800'
      };
    case 'intermedio':
      return { 
        label: 'Intermedio',
        color: 'bg-yellow-100 text-yellow-800'
      };
    case 'avanzato':
      return { 
        label: 'Avanzato',
        color: 'bg-red-100 text-red-800'
      };
    default:
      return { 
        label: difficulty,
        color: 'bg-gray-100 text-gray-800'
      };
  }
}

// Get equipment label and color
export function getEquipmentInfo(equipment: string): { label: string, color: string } {
  switch (equipment.toLowerCase()) {
    case 'corpo libero':
      return { 
        label: 'Corpo libero',
        color: 'bg-blue-100 text-blue-800'
      };
    case 'bilanciere':
      return { 
        label: 'Bilanciere',
        color: 'bg-purple-100 text-purple-800'
      };
    case 'manubri':
      return { 
        label: 'Manubri',
        color: 'bg-indigo-100 text-indigo-800'
      };
    case 'macchine':
      return { 
        label: 'Macchine',
        color: 'bg-pink-100 text-pink-800'
      };
    default:
      return { 
        label: equipment,
        color: 'bg-gray-100 text-gray-800'
      };
  }
}

// Format number with thousands separator
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('it-IT').format(num);
}

// Calculate BMI
export function calculateBMI(weight: number, heightInCm: number): number {
  const heightInMeters = heightInCm / 100;
  return weight / (heightInMeters * heightInMeters);
}

// Get BMI category
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Sottopeso';
  if (bmi < 25) return 'Normopeso';
  if (bmi < 30) return 'Sovrappeso';
  return 'Obesità';
}

// Calculate estimated daily calorie needs (Harris-Benedict equation)
export function calculateDailyCalories(
  weight: number, 
  heightInCm: number, 
  age: number, 
  gender: 'male' | 'female', 
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
): number {
  // Base Metabolic Rate
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * heightInCm) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * heightInCm) - (4.330 * age);
  }
  
  // Activity multiplier
  const activityMultipliers = {
    'sedentary': 1.2, // Little to no exercise
    'light': 1.375, // Light exercise 1-3 days/week
    'moderate': 1.55, // Moderate exercise 3-5 days/week
    'active': 1.725, // Hard exercise 6-7 days/week
    'very-active': 1.9 // Very hard exercise and physical job
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

// Generate a random color from a seed (for consistent colors per user/item)
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}
