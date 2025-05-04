import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { Workout } from "@shared/schema";

export default function TodaysWorkout() {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Fetch today's recommended workout
  const { data: workout, isLoading } = useQuery<Workout>({
    queryKey: ["/api/workouts/1"],
    placeholderData: {
      id: 1,
      name: "Allenamento completo upper body",
      description: "Un allenamento intenso per la parte superiore del corpo che lavora su petto, braccia e spalle",
      imageUrl: "",
      difficulty: "Intermedio",
      duration: 45,
      calories: 320,
      isTemplate: true,
      userId: null,
      createdAt: new Date(),
    },
  });

  const handleStartWorkout = () => {
    setIsAnimating(true);
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-heading">Allenamento di oggi</h2>
        <Link href="/workouts">
          <div className="text-primary font-semibold text-sm cursor-pointer">Vedi tutti</div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-5">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold mb-1">{workout?.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <i className="ri-time-line mr-1"></i> {workout?.duration} min
                    <span className="mx-2">•</span>
                    <i className="ri-fire-line mr-1"></i> {workout?.calories} kcal
                    <span className="mx-2">•</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {workout?.difficulty}
                    </span>
                  </div>
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
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                      Schiena
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {}}
                    className="flex items-center"
                  >
                    <i className="ri-calendar-line mr-1"></i> Programma
                  </Button>
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
