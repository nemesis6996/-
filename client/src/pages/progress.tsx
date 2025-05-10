import { useState } from "react";
import { motion } from "framer-motion";
// import Sidebar from "@/components/layout/sidebar"; // Rimosso perché non utilizzato
// import TopBar from "@/components/layout/topbar"; // Rimosso perché non utilizzato
import MobileNavigation from "@/components/layout/mobile-navigation";
import { useQuery } from "@tanstack/react-query";
import { UserWorkoutProgress } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell 
} from "recharts";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function Progress() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeRange, setTimeRange] = useState("week");
  
  const { data: progressData, isLoading } = useQuery<UserWorkoutProgress[]>({
    queryKey: ["/api/user-progress"],
    placeholderData: [], 
  });

  const calorieData = [
    { name: "Lun", calories: 320 },
    { name: "Mar", calories: 450 },
    { name: "Mer", calories: 280 },
    { name: "Gio", calories: 0 },
    { name: "Ven", calories: 390 },
    { name: "Sab", calories: 520 },
    { name: "Dom", calories: 180 },
  ];

  const workoutsByTypeData = [
    { name: "Upper Body", value: 8 },
    { name: "Lower Body", value: 6 },
    { name: "Core", value: 4 },
    { name: "Cardio", value: 5 },
  ];

  const monthlyProgressData = [
    { name: "Gen", workouts: 12, calories: 3800 },
    { name: "Feb", workouts: 15, calories: 4500 },
    { name: "Mar", workouts: 18, calories: 5200 },
    { name: "Apr", workouts: 16, calories: 4800 },
    { name: "Mag", workouts: 20, calories: 6000 },
    { name: "Giu", workouts: 22, calories: 6500 },
  ];

  return (
    <div className="flex h-screen bg-lightBg">
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
          >
            <h1 className="text-2xl font-bold">I tuoi progressi</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full sm:w-auto"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: it }) : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Intervallo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Ultima settimana</SelectItem>
                  <SelectItem value="month">Ultimo mese</SelectItem>
                  <SelectItem value="3months">Ultimi 3 mesi</SelectItem>
                  <SelectItem value="year">Ultimo anno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Allenamenti completati</CardTitle>
                <CardDescription>
                  Nell_ultimo {timeRange === "week" ? "settimana" : timeRange === "month" ? "mese" : timeRange === "3months" ? "trimestre" : "anno"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{progressData?.length || 0}</div>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="text-accent">↑ 0%</span> rispetto al periodo precedente
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Calorie bruciate</CardTitle>
                <CardDescription>
                  Nell_ultimo {timeRange === "week" ? "settimana" : timeRange === "month" ? "mese" : timeRange === "3months" ? "trimestre" : "anno"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  {progressData?.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0) || 0}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="text-accent">↑ 0%</span> rispetto al periodo precedente
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tempo totale</CardTitle>
                <CardDescription>
                  Nell_ultimo {timeRange === "week" ? "settimana" : timeRange === "month" ? "mese" : timeRange === "3months" ? "trimestre" : "anno"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                {`${Math.floor((progressData?.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0) || 0) / 60)}h ${((progressData?.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0) || 0) % 60)}m`}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="text-accent">↑ 0%</span> rispetto al periodo precedente
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Panoramica</TabsTrigger>
              <TabsTrigger value="calories">Calorie</TabsTrigger>
              <TabsTrigger value="workouts">Allenamenti</TabsTrigger>
              <TabsTrigger value="measurements">Misurazioni</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-0 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Calorie bruciate negli ultimi 7 giorni</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={calorieData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuzione allenamenti</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={workoutsByTypeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                            >
                              {workoutsByTypeData.map((_, index: number) => (
                                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Attività recenti</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {isLoading ? (
                          <div className="flex justify-center p-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        ) : progressData && progressData.length > 0 ? (
                          progressData.slice(0, 4).map((workout) => (
                            <div key={workout.id} className="flex items-start">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <span className="text-primary text-xl">💪</span> 
                              </div>
                              <div>
                                <p className="font-medium">Allenamento completato</p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(new Date(workout.completedAt))} • {workout.durationMinutes} min • {workout.caloriesBurned} kcal
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">Nessuna attività recente</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Progressi mensili</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyProgressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line 
                            yAxisId="left" 
                            type="monotone" 
                            dataKey="workouts" 
                            stroke="hsl(var(--primary))" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="calories" 
                            stroke="hsl(var(--secondary))" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            <TabsContent value="calories" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Calorie bruciate</CardTitle>
                    <CardDescription>Andamento dettagliato delle calorie bruciate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyProgressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="calories" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary) / 0.2)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            <TabsContent value="workouts" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Dettaglio degli allenamenti in arrivo presto.</p>
              </div>
            </TabsContent>
            <TabsContent value="measurements" className="mt-0">
              <div className="text-center py-12">
                <p className="text-gray-500">Tracciamento delle misurazioni in arrivo presto.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <MobileNavigation />
      </main>
    </div>
  );
}

