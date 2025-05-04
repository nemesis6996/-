import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { useQuery } from "@tanstack/react-query";
import { Program } from "@shared/schema";
import ProgramCard from "@/components/dashboard/program-card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  
  // Fetch all programs
  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });
  
  // Filter programs based on search and filters
  const filteredPrograms = programs?.filter(program => {
    // Search by name or description
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         program.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by difficulty
    const matchesDifficulty = selectedDifficulty === "all" || 
                             program.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    // Filter by duration
    const matchesDuration = selectedDuration === "all" || 
                           (selectedDuration === "short" && program.duration <= 4) ||
                           (selectedDuration === "medium" && program.duration > 4 && program.duration <= 8) ||
                           (selectedDuration === "long" && program.duration > 8);
    
    return matchesSearch && matchesDifficulty && matchesDuration;
  });

  return (
    <div className="flex h-screen bg-lightBg">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <TopBar title="Programmi" />
        
        <div className="p-4 md:p-6">
          {/* Header with search and add button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4"
          >
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca programmi..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-dark text-white">
                  <i className="ri-add-line mr-1"></i> Nuovo Programma
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crea Nuovo Programma</DialogTitle>
                  <DialogDescription>
                    Crea un programma personalizzato in base alle tue esigenze
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-gray-500">
                    Funzionalità in arrivo presto.
                  </p>
                </div>
                <DialogFooter>
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    Salva
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
          
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
          >
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
            
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Durata" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le durate</SelectItem>
                <SelectItem value="short">Breve (fino a 4 settimane)</SelectItem>
                <SelectItem value="medium">Media (5-8 settimane)</SelectItem>
                <SelectItem value="long">Lunga (più di 8 settimane)</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          
          {/* Programs Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tutti</TabsTrigger>
              <TabsTrigger value="templates">Predefiniti</TabsTrigger>
              <TabsTrigger value="custom">Personalizzati</TabsTrigger>
              <TabsTrigger value="active">Attivi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredPrograms?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nessun programma trovato. Prova a modificare i filtri.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredPrograms?.map((program, index) => (
                    <ProgramCard 
                      key={program.id}
                      program={program}
                      delay={0.05 * index}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Other tab contents would be similar */}
            <TabsContent value="templates" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Programmi predefiniti in arrivo presto.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Programmi personalizzati in arrivo presto.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Programmi attivi in arrivo presto.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
