import { Card } from "@/components/ui/card";
import { Program } from "@shared/schema"; // Assicurati che il percorso sia corretto e l'interfaccia Program sia esportata da schema
import { motion } from "framer-motion";
// import { useState } from "react"; // isHovered non è utilizzato
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ProgramCardProps {
  program: Program & { imageUrl?: string }; // Aggiunta opzionale di imageUrl se non sempre presente in Program
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
      // onHoverStart={() => setIsHovered(true)} // Rimosso perché isHovered non è utilizzato
      // onHoverEnd={() => setIsHovered(false)} // Rimosso perché isHovered non è utilizzato
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
                {program.duration && (
                  <span className="bg-secondary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    {program.duration} {program.duration.includes('settiman') ? '' : 'settimane'}
                  </span>
                )}
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
          {program.description && (
            <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden text-ellipsis">
              {program.description}
            </p>
          )}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Placeholder per utenti - da rendere dinamico */}
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs text-gray-600">+</div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs text-gray-600">1k</div>
              </div>
              <span className="text-xs text-gray-500 ml-2">utenti</span>
            </div>
            <Link href={`/programs/${program.id}">
              <Button variant="link" className="text-primary font-medium">
                Dettagli
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

