import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Rimosso CardDescription
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import type { Exercise as ExerciseType } from "@shared/schema"; // Importa il tipo Exercise da shared/schema

export default function ExerciseDetailPage() {
  const params = useParams();
  const exerciseId = params.id;

  const { data: exercise, isLoading, error } = useQuery<ExerciseType, Error>({
    queryKey: [`/api/exercises/${exerciseId}`],
    queryFn: async () => {
      // In un progetto reale, questa sarebbe una chiamata API effettiva
      // await new Promise(resolve => setTimeout(resolve, 1000)); 
      // Per ora, simuliamo il fetch da un endpoint che potrebbe non esistere o restituire un errore
      // se l'ID non è quello atteso per i dati fittizi.
      if (exerciseId === "1") { 
        return {
          id: "1",
          name: "Panca Piana con Bilanciere",
          description: "La panca piana con bilanciere è un esercizio fondamentale per lo sviluppo dei muscoli pettorali, dei tricipiti e dei deltoidi anteriori. Sdraiati sulla panca con i piedi ben appoggiati a terra. Afferra il bilanciere con una presa leggermente più ampia delle spalle. Abbassa lentamente il bilanciere fino a sfiorare il petto, mantenendo i gomiti leggermente piegati. Spingi il bilanciere verso l'alto fino a estendere completamente le braccia, senza bloccare i gomiti. Inspira durante la discesa ed espira durante la spinta.",
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVuY2glMjBwcmVzc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
          difficulty: "Intermedio",
          equipment: "Bilanciere, Panca",
          muscleGroups: ["Pettorali", "Tricipiti", "Deltoidi Anteriori"], // Assumendo che muscleGroups sia un array di stringhe (nomi)
        };
      }
      // Simula un fetch reale che potrebbe fallire o non trovare l'esercizio
      const response = await fetch(`/api/exercises/${exerciseId}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error("Esercizio non trovato.");
        throw new Error("Errore nel caricamento dell'esercizio.");
      }
      return response.json();
    },
    enabled: !!exerciseId,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-lightBg">
        <Sidebar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <TopBar title="Caricamento Esercizio..." />
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </main>
        <MobileNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-lightBg">
        <Sidebar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <TopBar title="Errore" />
          <div className="p-4 md:p-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Errore nel caricamento dell'esercizio</AlertTitle>
              <AlertDescription>
                {error.message || "Si è verificato un problema nel recuperare i dettagli dell'esercizio."}
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <MobileNavigation />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex h-screen bg-lightBg">
        <Sidebar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <TopBar title="Esercizio non Trovato" />
          <div className="p-4 md:p-6">
            <Alert variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Esercizio non trovato</AlertTitle>
              <AlertDescription>
                L'esercizio che stai cercando non esiste o è stato rimosso.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-lightBg">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <TopBar title={exercise.name} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 md:p-6"
        >
          <Card className="overflow-hidden">
            {exercise.imageUrl && (
              <div className="h-64 md:h-96 w-full overflow-hidden">
                <img 
                  src={exercise.imageUrl} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">{exercise.name}</CardTitle>
              {/* CardDescription non è più usata qui */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{exercise.difficulty}</Badge>
                {exercise.equipment && <Badge variant="outline">{exercise.equipment}</Badge>}
                {exercise.muscleGroups?.map((group) => (
                  <Badge key={group} variant="default">{group}</Badge> // Assumendo che group sia una stringa (nome del gruppo)
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Spiegazione dell'esercizio</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {exercise.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <MobileNavigation />
    </div>
  );
}

