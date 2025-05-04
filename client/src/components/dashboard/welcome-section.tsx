import { useState } from "react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function WelcomeSection() {
  const user = useSelector((state: RootState) => state.user.user);
  const progress = useSelector((state: RootState) => state.user.weeklyProgress);
  
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleStartWorkout = () => {
    setIsAnimating(true);
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary to-primary-light text-white rounded-xl p-6 mb-6 shadow-lg"
    >
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading mb-1">
            Ciao, {user?.name?.split(' ')[0] || 'Utente'}! 👋
          </h2>
          <p className="text-white/90 mb-4">
            Pronto per il tuo allenamento di oggi?
          </p>
          <motion.div
            whileTap={{ scale: 0.95 }}
            animate={isAnimating ? { scale: [1, 0.95, 1] } : {}}
          >
            <Link href="/workouts">
              <Button 
                onClick={handleStartWorkout}
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Inizia Allenamento
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="mt-6 md:mt-0 flex items-center">
          <ProgressRing 
            percent={progress}
            label="Obiettivo"
            sublabel="Settimanale"
          />
        </div>
      </div>
    </motion.div>
  );
}
