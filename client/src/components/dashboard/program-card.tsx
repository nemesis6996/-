import { Card } from "@/components/ui/card";
import { Program } from "@shared/schema";
import { motion } from "framer-motion";
// import { useState } from "react"; // Rimosso perché isHovered non è utilizzato
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ProgramCardProps {
  program: Program;
  delay?: number;
}

export default function ProgramCard({ program, delay = 0 }: ProgramCardProps) {
  // const [isHovered, setIsHovered] = useState(false); // Rimosso perché non utilizzato
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
      // onHoverStart={() => setIsHovered(true)} // Rimosso
      // onHoverEnd={() => setIsHovered(false)}   // Rimosso
    >
      <Card className="h-full overflow-hidden shadow-md hover:shadow-lg">
        <div className="relative h-48">
          {program.imageUrl ? (
            <img
              src={program.imageUrl}
              alt={program.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Nessuna immagine</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-4 text-white">
              <div className="flex items-center mb-1">
                <span className="bg-secondary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                  {program.duration} settimane
                </span>
              </div>
              <h3 className="font-bold text-lg">{program.name}</h3>
              {program.frequency && (
                <div className="flex items-center text-xs">
                  <i className="ri-time-line mr-1"></i> {program.frequency}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4">{program.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Placeholder per avatar utenti iscritti */}
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300"></div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-400"></div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500"></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">+1.8k iscritti</span>
            </div>
            <Link href={`/programs/${program.id}`}>
              <Button asChild variant="link" className="text-primary font-medium">
                <a>Dettagli</a>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

