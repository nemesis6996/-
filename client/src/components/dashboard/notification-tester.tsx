import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SassyNotification } from "@/data/sassy-notifications";
import { motion } from "framer-motion";

// Interfaccia per la funzione globale di notifica
declare global {
  interface Window {
    showSassyNotification?: {
      random: () => void;
      decreasedWeight: (severity: SassyNotification['severity']) => void;
      missedWorkout: (severity: SassyNotification['severity']) => void;
    };
  }
}

const NotificationTester = () => {
  const [severity, setSeverity] = useState<SassyNotification['severity']>("medium");

  const handleRandomNotification = () => {
    window.showSassyNotification?.random();
  };

  const handleDecreasedWeightNotification = () => {
    window.showSassyNotification?.decreasedWeight(severity);
  };

  const handleMissedWorkoutNotification = () => {
    window.showSassyNotification?.missedWorkout(severity);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Test Notifiche "Provocatorie" 🔥</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Livello di provocazione:</h3>
              <RadioGroup 
                defaultValue="medium" 
                value={severity}
                onValueChange={(val) => setSeverity(val as SassyNotification['severity'])}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Leggero</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="harsh" id="harsh" />
                  <Label htmlFor="harsh">Pesante 🤬</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                variant="default" 
                onClick={handleRandomNotification}
                className="w-full"
              >
                Notifica Casuale
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleMissedWorkoutNotification}
                className="w-full"
              >
                Allenamento Saltato
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDecreasedWeightNotification}
                className="w-full"
              >
                Peso Diminuito
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Queste notifiche compariranno anche casualmente durante l'utilizzo dell'app per mantenerti motivato... a modo loro! 😈
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationTester;