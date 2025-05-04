import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { useQuery } from "@tanstack/react-query";
import { Exercise, MuscleGroup } from "@shared/schema";
import ExerciseCard from "@/components/dashboard/exercise-card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState("all");
  
  // Fetch all exercises
  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });
  
  // Fetch muscle groups
  const { data: muscleGroups } = useQuery<MuscleGroup[]>({
    queryKey: ["/api/muscle-groups"],
  });
  
  // Filter exercises based on search and filters
  const filteredExercises = exercises?.filter(exercise => {
    // Search by name or description
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by muscle group
    const matchesMuscleGroup = selectedMuscleGroup === "all" || 
                              exercise.muscleGroupId.toString() === selectedMuscleGroup;
    
    // Filter by difficulty
    const matchesDifficulty = selectedDifficulty === "all" || 
                             exercise.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    // Filter by equipment
    const matchesEquipment = selectedEquipment === "all" || 
                            exercise.equipment.toLowerCase() === selectedEquipment.toLowerCase();
    
    return matchesSearch && matchesMuscleGroup && matchesDifficulty && matchesEquipment;
  });

  return (
    <div className="flex h-screen bg-lightBg">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <TopBar title="Esercizi" />
        
        <div className="p-4 md:p-6">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="relative mb-4">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca esercizi..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Gruppo muscolare" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i gruppi muscolari</SelectItem>
                  {muscleGroups?.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficoltà" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le difficoltà</SelectItem>
                  <SelectItem value="principiante">Principiante</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzato">Avanzato</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Attrezzatura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le attrezzature</SelectItem>
                  <SelectItem value="corpo libero">Corpo libero</SelectItem>
                  <SelectItem value="bilanciere">Bilanciere</SelectItem>
                  <SelectItem value="manubri">Manubri</SelectItem>
                  <SelectItem value="macchine">Macchine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          
          {/* Tabs for categorization */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tutti</TabsTrigger>
              <TabsTrigger value="upper">Upper Body</TabsTrigger>
              <TabsTrigger value="lower">Lower Body</TabsTrigger>
              <TabsTrigger value="core">Core</TabsTrigger>
              <TabsTrigger value="cardio">Cardio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredExercises?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nessun esercizio trovato. Prova a modificare i filtri.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredExercises?.map((exercise, index) => (
                    <ExerciseCard 
                      key={exercise.id}
                      exercise={exercise}
                      delay={0.05 * index}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Other tab contents would be similar */}
            <TabsContent value="upper" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Contenuto di Upper Body in arrivo presto.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="lower" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Contenuto di Lower Body in arrivo presto.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="core" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Contenuto di Core in arrivo presto.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="cardio" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Contenuto di Cardio in arrivo presto.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
