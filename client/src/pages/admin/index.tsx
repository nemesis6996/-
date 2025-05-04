import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Tipi di dati utilizzati nell'interfaccia di amministrazione
interface DashboardStats {
  usersCount: number;
  exercisesCount: number;
  workoutsCount: number;
  programsCount: number;
  completedWorkouts: number;
  activeUsers: number;
}

interface ActivityData {
  day: string;
  workouts: number;
  registrations: number;
}

export default function AdminDashboard() {
  const user = useSelector((state: RootState) => state.user.user);
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    usersCount: 0,
    exercisesCount: 0, 
    workoutsCount: 0,
    programsCount: 0,
    completedWorkouts: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Dati di esempio per il grafico (in un'app reale sarebbero caricati dal server)
  const activityData: ActivityData[] = [
    { day: 'Lun', workouts: 12, registrations: 3 },
    { day: 'Mar', workouts: 19, registrations: 4 },
    { day: 'Mer', workouts: 15, registrations: 2 },
    { day: 'Gio', workouts: 18, registrations: 5 },
    { day: 'Ven', workouts: 25, registrations: 7 },
    { day: 'Sab', workouts: 22, registrations: 2 },
    { day: 'Dom', workouts: 8, registrations: 1 },
  ];

  // Funzione per recuperare le statistiche della dashboard
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // In un'implementazione reale, questi dati verrebbero recuperati da API
      // Dati di esempio
      setStats({
        usersCount: 120,
        exercisesCount: 85,
        workoutsCount: 45,
        programsCount: 12,
        completedWorkouts: 543,
        activeUsers: 78
      });
      
      // Simuliamo una richiesta API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoading(false);
    } catch (error) {
      console.error("Errore durante il recupero delle statistiche:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati della dashboard",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Controlla che l'utente sia admin
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <AdminSidebar activeItem="dashboard" />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Pannello Amministrativo</h1>
            <p className="text-gray-500 mt-1">Gestisci la tua piattaforma fitness</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Utenti</p>
                    <p className="text-3xl font-bold mt-1">{stats.usersCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-2xl text-primary"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Esercizi</p>
                    <p className="text-3xl font-bold mt-1">{stats.exercisesCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className="ri-heart-pulse-line text-2xl text-primary"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Schede</p>
                    <p className="text-3xl font-bold mt-1">{stats.workoutsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className="ri-run-line text-2xl text-primary"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Programmi</p>
                    <p className="text-3xl font-bold mt-1">{stats.programsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className="ri-calendar-todo-line text-2xl text-primary"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Attività settimanale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="workouts" name="Allenamenti" fill="#000000" />
                      <Bar dataKey="registrations" name="Registrazioni" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistiche piattaforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Allenamenti completati</span>
                    <span className="text-xl font-bold">{stats.completedWorkouts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Utenti attivi</span>
                    <span className="text-xl font-bold">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tasso di completamento</span>
                    <span className="text-xl font-bold">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tempo medio sessione</span>
                    <span className="text-xl font-bold">45 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="recent">
            <TabsList className="mb-4">
              <TabsTrigger value="recent">Attività recenti</TabsTrigger>
              <TabsTrigger value="todo">To-Do</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Attività recenti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <i className="ri-user-add-line text-lg text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium">Nuovo utente registrato</p>
                        <p className="text-sm text-gray-500">Laura Bianchi si è registrata alla piattaforma</p>
                        <p className="text-xs text-gray-400 mt-1">2 ore fa</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <i className="ri-file-list-3-line text-lg text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium">Nuovo esercizio aggiunto</p>
                        <p className="text-sm text-gray-500">È stato aggiunto l'esercizio "Plank con rotazione"</p>
                        <p className="text-xs text-gray-400 mt-1">5 ore fa</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <i className="ri-calendar-event-line text-lg text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium">Programma aggiornato</p>
                        <p className="text-sm text-gray-500">Il programma "Zero Equipment Full Body" è stato aggiornato</p>
                        <p className="text-xs text-gray-400 mt-1">Ieri</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="todo">
              <Card>
                <CardHeader>
                  <CardTitle>Attività da completare</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <i className="ri-video-line text-lg text-amber-500"></i>
                      </div>
                      <div>
                        <p className="font-medium">Aggiungere video agli esercizi</p>
                        <p className="text-sm text-gray-500">15 esercizi mancano ancora del video dimostrativo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <i className="ri-notification-2-line text-lg text-amber-500"></i>
                      </div>
                      <div>
                        <p className="font-medium">Creare nuove notifiche motivazionali</p>
                        <p className="text-sm text-gray-500">Aggiungere 10 nuove notifiche per utenti che saltano gli allenamenti</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <i className="ri-calendar-todo-line text-lg text-amber-500"></i>
                      </div>
                      <div>
                        <p className="font-medium">Creare nuovo programma stagionale</p>
                        <p className="text-sm text-gray-500">Preparare il programma "Summer Body Challenge"</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}