import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Workout } from "@shared/schema"; // Importa come tipo

export default function TodaysWorkout() {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Fetch today_s recommended workout
  const { data: workout, isLoading } = useQuery<Workout, Error>({
    queryKey: ["todayWorkout"], // Aggiornato queryKey per essere più specifico e univoco
    // La placeholderData deve corrispondere al tipo Workout, inclusi tutti i campi richiesti come id
    placeholderData: {
      id: "placeholder-workout-id", // Aggiunto ID placeholder
      name: "Allenamento completo upper body",
      description: "Un allenamento intenso per la parte superiore del corpo che lavora su petto, braccia e spalle",
      imageUrl: "/images/placeholder-workout.jpg", // Aggiunto un URL placeholder per l_immagine
      difficulty: "Intermedio",
      duration: 45,
      calories: 320,
      isTemplate: true,
      userId: null,
      createdAt: new Date().toISOString(), // Convertito in stringa ISO come definito in schema.ts
      exercises: [], // Aggiunto array di esercizi vuoto se richiesto da Workout
      muscleGroups: ["petto", "braccia", "spalle"], // Aggiunto se richiesto da Workout
      completed: false, // Aggiunto campo mancante
    },
    // queryFn: async () => apiRequest("GET", "/api/workouts/today") // Esempio di queryFn, da implementare
    // Per ora, useQuery si aspetterà che i dati (o placeholderData) corrispondano a Workout
    // Se queryFn non è fornita e non ci sono dati in cache, userà placeholderData.
  });

  const handleStartWorkout = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-heading">Allenamento di oggi</h2>
        <Link href="/workouts">
          <a className="text-primary font-semibold text-sm cursor-pointer hover:underline">Vedi tutti</a>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-5">
            {isLoading && !workout ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : workout ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                  <h3 className="text-lg font-bold mb-1">{workout.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap">
                    {workout.duration && (
                      <span className="flex items-center mr-3">
                        <i className="ri-time-line mr-1"></i> {workout.duration} min
                      </span>
                    )}
                    {workout.calories && (
                      <span className="flex items-center mr-3">
                        <i className="ri-fire-line mr-1"></i> {workout.calories} kcal
                      </span>
                    )}
                    {workout.difficulty && (
                       <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                         {workout.difficulty}
                       </span>
                    )}
                  </div>
                  {/* Assicurarsi che muscleGroups esista e sia un array prima di chiamare .map */} 
                  {workout.muscleGroups && Array.isArray(workout.muscleGroups) && workout.muscleGroups.length > 0 && (
                    <div className="flex items-center flex-wrap">
                      {workout.muscleGroups.slice(0, 4).map((group: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-2 capitalize">
                          {group}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-3 flex-shrink-0 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    // onClick={() => {}} // Azione da definire
                    className="flex items-center"
                  >
                    <i className="ri-calendar-line mr-1"></i> Programma
                  </Button>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    animate={isAnimating ? { scale: [1, 0.95, 1] } : {}}
                  >
                    {/* Assicurarsi che workout.id esista */} 
                    <Link href={workout.id ? `/workouts/${workout.id}/start` : "/workouts"}> 
                      <Button
                        asChild // Permette al Link di controllare la navigazione
                        onClick={handleStartWorkout} 
                        className="bg-primary hover:bg-primary-dark text-white"
                      >
                        <a>Inizia ora</a>
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nessun allenamento consigliato per oggi.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

