import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { Workout } from "@shared/schema"; // Assicurati che il percorso sia corretto

export default function TodaysWorkout() {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Fetch today's recommended workout
  // Nota: l'ID "1" è hardcoded, potrebbe essere necessario renderlo dinamico
  const { data: workout, isLoading } = useQuery<Workout>({
    queryKey: ["/api/workouts/today"], // Modificato per una chiave più semantica
    // placeholderData: { // Rimosso placeholderData per usare i tipi definiti, o assicurati che corrisponda a Workout
    //   id: "mock-workout-id", // ID deve essere stringa come da schema
    //   name: "Allenamento completo upper body",
    //   description: "Un allenamento intenso per la parte superiore del corpo che lavora su petto, braccia e spalle",
    //   imageUrl: "",
    //   difficulty: "Intermedio",
    //   duration: 45,
    //   calories: 320,
    //   isTemplate: true,
    //   userId: null,
    //   createdAt: new Date().toISOString(), // Convertito in stringa ISO
    //   date: new Date().toISOString(),
    //   exercises: [],
    // },
  });

  const handleStartWorkout = () => {
    setIsAnimating(true);
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 500);
    // TODO: Logica per iniziare l'allenamento, es. navigare alla pagina dell'allenamento
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-heading">Allenamento di oggi</h2>
        <Link href="/workouts">
          <div className="text-primary font-semibold text-sm cursor-pointer hover:underline">Vedi tutti</div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-5">
            {isLoading && !workout && (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {!isLoading && !workout && (
                 <div className="text-center py-10">
                    <p className="text-gray-500">Nessun allenamento programmato per oggi.</p>
                    <Link href="/programs">
                        <Button variant="link" className="mt-2">Esplora i programmi</Button>
                    </Link>
                 </div>
            )}
            {workout && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 flex-grow">
                  <h3 className="text-lg font-bold mb-1">{workout.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap">
                    {workout.duration && <><i className="ri-time-line mr-1"></i> {workout.duration} min</>}
                    {workout.calories && <><span className="mx-2">•</span><i className="ri-fire-line mr-1"></i> {workout.calories} kcal</>}
                    {workout.difficulty && 
                      <>
                        <span className="mx-2">•</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {workout.difficulty}
                        </span>
                      </>
                    }
                  </div>
                  {/* TODO: Rendere dinamici i gruppi muscolari in base a workout.exercises */}
                  <div className="flex items-center flex-wrap">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      Spalle
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      Petto
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      Braccia
                    </span>
                    {/* <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      Schiena
                    </span> */}
                  </div>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0 flex-shrink-0">
                  <Link href={`/programs/${workout.programId || ''}${workout.programId ? '?startWorkout=' + workout.id : ''}`}>
                    <Button
                      variant="outline"
                      className="flex items-center"
                      disabled={!workout.programId}
                    >
                      <i className="ri-calendar-line mr-1"></i> Programma
                    </Button>
                  </Link>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    animate={isAnimating ? { scale: [1, 0.95, 1] } : {}}
                  >
                    <Button
                      onClick={handleStartWorkout}
                      className="bg-primary hover:bg-primary-dark text-white"
                    >
                      Inizia ora
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

