import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react"; // Rimosso Info perché non utilizzato
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Dati per il grafico a torta
const createPieData = (progress: number) => [
  { name: "Completato", value: progress },
  { name: "Rimanente", value: 100 - progress }
];

// Colori per il grafico
const COLORS = ["#4f46e5", "#e5e7eb"];

const GoalProgress = () => {
  const weeklyProgress = useSelector((state: RootState) => state.user.weeklyProgress);
  // setPieData rimosso perché pieData non viene mai aggiornato dopo l'inizializzazione
  const [pieData] = useState(createPieData(weeklyProgress)); 
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              Obiettivo settimanale
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                      <HelpCircle className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Il tuo obiettivo è di completare almeno 4 allenamenti a settimana.
                      Continua così!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="text-sm text-gray-600 flex items-center">
              {/* TODO: Dinamizzare questo valore in base ai dati reali */}
              <span>3 di 4 allenamenti</span> 
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {/* Parametro 'entry' rimosso perché non utilizzato, solo l'indice serve per i COLORS */} 
                    {pieData.map((_, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        const { cx, cy } = viewBox as { cx: number; cy: number };
                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={cx}
                              y={cy}
                              className="text-2xl font-bold"
                              fill="#1f2937"
                            >
                              {`${weeklyProgress}%`}
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy + 20}
                              className="text-xs"
                              fill="#6b7280"
                            >
                              completato
                            </tspan>
                          </text>
                        );
                      }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mb-4">
              <div className="text-lg font-semibold mb-1">Ottimo lavoro!</div>
              <div className="text-sm text-gray-600">
                Sei sulla buona strada per raggiungere il tuo obiettivo settimanale.
              </div>
            </div>
            {/* TODO: Dinamizzare questi valori in base ai dati reali */}
            <div className="grid grid-cols-3 w-full gap-2 text-center">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-sm text-gray-600">Calorie</div>
                <div className="font-semibold">1,250</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-sm text-gray-600">Minuti</div>
                <div className="font-semibold">135</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-sm text-gray-600">Esercizi</div>
                <div className="font-semibold">24</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalProgress;

