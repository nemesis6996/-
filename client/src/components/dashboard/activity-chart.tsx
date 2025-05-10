import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dati di esempio per l'attività settimanale
const weeklyData = [
  { giorno: "Lun", minuti: 45, calorie: 320 },
  { giorno: "Mar", minuti: 30, calorie: 250 },
  { giorno: "Mer", minuti: 60, calorie: 450 },
  { giorno: "Gio", minuti: 0, calorie: 0 },
  { giorno: "Ven", minuti: 50, calorie: 380 },
  { giorno: "Sab", minuti: 75, calorie: 520 },
  { giorno: "Dom", minuti: 20, calorie: 180 },
];

// Dati di esempio per l'attività mensile
const monthlyData = [
  { settimana: "Sett 1", minuti: 200, calorie: 1500 },
  { settimana: "Sett 2", settimana_num: 2, minuti: 280, calorie: 2100 },
  { settimana: "Sett 3", settimana_num: 3, minuti: 180, calorie: 1350 },
  { settimana: "Sett 4", settimana_num: 4, minuti: 305, calorie: 2300 },
];

// Dati di esempio per i muscoli allenati
const muscleGroupData = [
  { gruppo: "Petto", sessioni: 4 },
  { gruppo: "Braccia", sessioni: 3 },
  { gruppo: "Gambe", sessioni: 3 },
  { gruppo: "Addome", sessioni: 5 },
  { gruppo: "Schiena", sessioni: 2 },
  { gruppo: "Spalle", sessioni: 3 },
];

// Dati di esempio per i progressi su diversi esercizi
// const exerciseProgressData = [
//   { nome: "Panca", settimana1: 60, settimana2: 65, settimana3: 70, settimana4: 75 },
//   { nome: "Squat", settimana1: 80, settimana2: 85, settimana3: 90, settimana4: 95 },
//   { nome: "Stacchi", settimana1: 100, settimana2: 110, settimana3: 115, settimana4: 120 },
// ];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number | string; color?: string; [key: string]: any }>;
  label?: string | number;
  unit?: string;
}

// Personalizzazione tooltip per i grafici
const CustomTooltip = ({ active, payload, label, unit = "" }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md text-gray-800">
        <p className="font-medium">{label}</p>
        {payload.map((entry: { name: string; value: number | string; color?: string }, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value} {unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ActivityChart = () => {
  const [timeRange, setTimeRange] = useState("week");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Tabs defaultValue="activity" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="activity">Attività</TabsTrigger>
            <TabsTrigger value="muscles">Gruppi Muscolari</TabsTrigger>
            <TabsTrigger value="progress">Progressi</TabsTrigger>
          </TabsList>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Ultima settimana</SelectItem>
              <SelectItem value="month">Ultimo mese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Grafico dell'attività */}
        <TabsContent value="activity">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{timeRange === "week" ? "Attività settimanale" : "Attività mensile"}</CardTitle>
              <CardDescription>
                {timeRange === "week" 
                  ? "Minuti di allenamento e calorie bruciate negli ultimi 7 giorni" 
                  : "Panoramica dell'attività nelle ultime 4 settimane"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {timeRange === "week" ? (
                    <BarChart data={weeklyData} barGap={0} barCategoryGap="10%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="giorno" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="minuti" name="Minuti" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="calorie" name="Calorie" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <BarChart data={monthlyData} barGap={0} barCategoryGap="10%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="settimana" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="minuti" name="Minuti totali" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="calorie" name="Calorie totali" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Grafico dei gruppi muscolari */}
        <TabsContent value="muscles">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Gruppi muscolari allenati</CardTitle>
              <CardDescription>
                Distribuzione degli allenamenti per gruppo muscolare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={muscleGroupData} 
                    barCategoryGap="20%" 
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="gruppo" type="category" width={80} />
                    <Tooltip content={<CustomTooltip unit="sessioni" />} />
                    <Bar 
                      dataKey="sessioni" 
                      name="Sessioni" 
                      fill="#ff7c43" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Grafico dei progressi di peso */}
        <TabsContent value="progress">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Progressi nei pesi</CardTitle>
              <CardDescription>
                Andamento nei principali esercizi (kg)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    {name: 'Settimana 1', Panca: 60, Squat: 80, Stacchi: 100},
                    {name: 'Settimana 2', Panca: 65, Squat: 85, Stacchi: 110},
                    {name: 'Settimana 3', Panca: 70, Squat: 90, Stacchi: 115},
                    {name: 'Settimana 4', Panca: 75, Squat: 95, Stacchi: 120},
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip unit="kg" />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Panca" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Squat" 
                      stroke="#82ca9d" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Stacchi" 
                      stroke="#ffc658" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ActivityChart;

