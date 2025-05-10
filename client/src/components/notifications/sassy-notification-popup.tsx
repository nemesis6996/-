import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { useToast } from "@/hooks/use-toast"; // Commentato perché toast non è utilizzato
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
  // const { toast } = useToast(); // Commentato perché toast non è utilizzato
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  // Funzione per mostrare una notifica provocatoria casuale
  const showRandomNotification = () => {
    const types: SassyNotification['type'][] = [
      'missed_workout',
      'decreased_weight',
      'skipped_days',
      'incomplete_sets',
      'achievement',
      'motivation'
    ];
    const severities: SassyNotification['severity'][] = [
      'light',
      'medium',
      'harsh'
    ];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const randomNotificationData = getRandomNotification(randomType, randomSeverity);
    
    setNotification(randomNotificationData);
    setVisible(true);
    
    dispatch(addNotification({
      text: randomNotificationData.message,
      time: 'Ora'
    }));
    
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  useEffect(() => {
    if (!showRandomInterval || !isAuthenticated) return;
    
    const scheduleNextNotification = () => {
      const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;
      
      const timeoutId = setTimeout(() => {
        showRandomNotification();
        scheduleNextNotification();
      }, randomInterval);
      
      return timeoutId;
    };
    
    const timeoutId = scheduleNextNotification();
    
    return () => clearTimeout(timeoutId);
  }, [showRandomInterval, minInterval, maxInterval, isAuthenticated, dispatch]); // Aggiunto dispatch alle dipendenze

  const closeNotification = () => {
    setVisible(false);
  };

  const showDecreasedWeightNotification = (severity: SassyNotification['severity'] = 'medium') => {
    const notificationData = getRandomNotification('decreased_weight', severity);
    setNotification(notificationData);
    setVisible(true);
    
    dispatch(addNotification({
      text: notificationData.message,
      time: 'Ora'
    }));
    
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  const showMissedWorkoutNotification = (severity: SassyNotification['severity'] = 'harsh') => {
    const notificationData = getRandomNotification('missed_workout', severity);
    setNotification(notificationData);
    setVisible(true);
    
    dispatch(addNotification({
      text: notificationData.message,
      time: 'Ora'
    }));
    
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Aggiunto dispatch alle dipendenze, e disabilitato avviso per showRandomNotification etc.

  return (
    <AnimatePresence>
      {visible && notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className={`fixed top-4 inset-x-0 z-50 mx-auto w-11/12 max-w-sm rounded-lg border p-4 shadow-lg ${getBackgroundForSeverity(notification.severity)} ${getTextColorForSeverity(notification.severity)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIconForType(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium`}>
                {notification.title}
              </p>
              <p className={`mt-1 text-sm opacity-90`}>
                {notification.message}
              </p>
            </div>
            <button
              type="button"
              className={`ml-auto flex-shrink-0 rounded-md bg-transparent p-1.5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getTextColorForSeverity(notification.severity)}`}
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

