import { Card } from "@/components/ui/card";
import { Exercise } from "@shared/schema";
import { motion } from "framer-motion";
import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ExerciseCardProps {
  exercise: Exercise;
  delay?: number;
}

export default function ExerciseCard({ exercise, delay = 0 }: ExerciseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden exercise-card transition duration-300 shadow-md hover:shadow-lg">
        <div className="relative h-48">
          {exercise.imageUrl ? (
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Nessuna immagine</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-4 text-white">
              <h3 className="font-bold text-lg">{exercise.name}</h3>
              <div className="flex items-center text-xs">
                <i className="ri-time-line mr-1"></i> 3 set × 12 ripetizioni
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center flex-wrap mb-3">
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-1">
              Petto
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2 mb-1">
              Tricipiti
            </span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs mr-2 mb-1">
              {exercise.difficulty}
            </span>
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary transition-colors">
              <Info className="h-5 w-5" />
            </Button>
            <Link href={`/exercises/${exercise.id}`}>
              <div className="cursor-pointer">
                <Button variant="link" className="text-primary font-medium">
                  Vedi dettagli
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
