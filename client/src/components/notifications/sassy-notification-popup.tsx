import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { SassyNotification, getRandomNotification } from "@/data/sassy-notifications";
import { X, Award, Flame, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addNotification } from "@/store/user-slice";

interface SassyNotificationPopupProps {
  showRandomInterval?: boolean;
  minInterval?: number;
  maxInterval?: number;
}

const getIconForType = (type: SassyNotification['type']) => {
  switch (type) {
    case 'achievement':
      return <Award className="h-6 w-6 text-yellow-500" />;
    case 'motivation':
      return <Flame className="h-6 w-6 text-orange-500" />;
    default:
      return <AlertTriangle className="h-6 w-6 text-red-500" />;
  }
};

const getBackgroundForSeverity = (severity: SassyNotification['severity']) => {
  switch (severity) {
    case 'light':
      return "bg-blue-50 border-blue-200";
    case 'medium':
      return "bg-amber-50 border-amber-200";
    case 'harsh':
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getTextColorForSeverity = (severity: SassyNotification['severity']) => {
  switch (severity) {
    case 'light':
      return "text-blue-800";
    case 'medium':
      return "text-amber-800";
    case 'harsh':
      return "text-red-800";
    default:
      return "text-gray-800";
  }
};

const SassyNotificationPopup: React.FC<SassyNotificationPopupProps> = ({
  showRandomInterval = true,
  minInterval = 120000, // 2 minuti
  maxInterval = 300000, // 5 minuti
}) => {
  const [notification, setNotification] = useState<SassyNotification | null>(null);
  const [visible, setVisible] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  // Funzione per mostrare una notifica provocatoria casuale
  const showRandomNotification = () => {
    // Lista di possibili tipi di notifica per mostrare qualcosa di casuale
    const types: SassyNotification['type'][] = [
      'missed_workout',
      'decreased_weight',
      'skipped_days',
      'incomplete_sets',
      'achievement',
      'motivation'
    ];
    
    // Lista di possibili livelli di severità
    const severities: SassyNotification['severity'][] = [
      'light',
      'medium',
      'harsh'
    ];
    
    // Scegli un tipo e una severità casuale
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    
    // Ottieni una notifica casuale
    const randomNotification = getRandomNotification(randomType, randomSeverity);
    
    // Imposta la notifica e rendila visibile
    setNotification(randomNotification);
    setVisible(true);
    
    // Aggiungi la notifica anche allo store Redux
    dispatch(addNotification({
      text: randomNotification.message,
      time: 'Ora'
    }));
    
    // Dopo 5 secondi, nascondi la notifica
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  // Mostra notifiche provocatorie a intervalli casuali se l'utente è autenticato
  useEffect(() => {
    if (!showRandomInterval || !isAuthenticated) return;
    
    // Funzione per mostrare una notifica dopo un intervallo casuale
    const scheduleNextNotification = () => {
      const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;
      
      const timeoutId = setTimeout(() => {
        showRandomNotification();
        scheduleNextNotification(); // Pianifica la prossima notifica
      }, randomInterval);
      
      return timeoutId;
    };
    
    const timeoutId = scheduleNextNotification();
    
    // Pulisci il timeout quando il componente viene smontato
    return () => clearTimeout(timeoutId);
  }, [showRandomInterval, minInterval, maxInterval, isAuthenticated]);

  // Funzione per chiudere manualmente la notifica
  const closeNotification = () => {
    setVisible(false);
  };

  // Funzione per mostrare una notifica in caso di diminuzione del peso
  const showDecreasedWeightNotification = (severity: SassyNotification['severity'] = 'medium') => {
    const notification = getRandomNotification('decreased_weight', severity);
    setNotification(notification);
    setVisible(true);
    
    dispatch(addNotification({
      text: notification.message,
      time: 'Ora'
    }));
    
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  // Funzione per mostrare una notifica in caso di allenamento mancato
  const showMissedWorkoutNotification = (severity: SassyNotification['severity'] = 'harsh') => {
    const notification = getRandomNotification('missed_workout', severity);
    setNotification(notification);
    setVisible(true);
    
    dispatch(addNotification({
      text: notification.message,
      time: 'Ora'
    }));
    
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  // Esponi le funzioni all'esterno tramite window
  useEffect(() => {
    // @ts-ignore
    window.showSassyNotification = {
      random: showRandomNotification,
      decreasedWeight: showDecreasedWeightNotification,
      missedWorkout: showMissedWorkoutNotification
    };
    
    return () => {
      // @ts-ignore
      delete window.showSassyNotification;
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className={`fixed top-4 inset-x-0 z-50 mx-auto w-11/12 max-w-sm rounded-lg border p-4 shadow-lg ${getBackgroundForSeverity(notification.severity)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIconForType(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${getTextColorForSeverity(notification.severity)}`}>
                {notification.title}
              </p>
              <p className={`mt-1 text-sm ${getTextColorForSeverity(notification.severity)} opacity-90`}>
                {notification.message}
              </p>
            </div>
            <button
              type="button"
              className="ml-auto flex-shrink-0 rounded-md bg-transparent p-1.5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={closeNotification}
            >
              <span className="sr-only">Chiudi</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SassyNotificationPopup;