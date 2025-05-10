import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useSelector } from "react-redux"; // Rimosso perché non utilizzato
// import { RootState } from "@/store/store"; // Rimosso perché non utilizzato
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface ActivityItemProps {
  icon: string;
  iconColor: string;
  timestamp: Date;
  title: string;
  description: string;
  index: number;
}

const ActivityItem = ({ icon, iconColor, timestamp, title, description, index }: ActivityItemProps) => {
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true, locale: it });
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
      className="flex items-start space-x-3 py-3 border-b last:border-0 border-gray-200"
    >
      <div className={`p-2 rounded-full ${iconColor} mt-1 text-white`}>
        <i className={`${icon} text-sm`}></i>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-sm">{title}</h4>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </motion.div>
  );
};

// Impostazione attività di esempio
const activities = [
  {
    icon: "ri-heart-pulse-line",
    iconColor: "bg-primary",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 ore fa
    title: "Allenamento di cardio",
    description: "Hai completato 30 minuti di corsa e bruciato 320 calorie."
  },
  {
    icon: "ri-boxing-line",
    iconColor: "bg-secondary",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 giorno fa
    title: "Allenamento braccia",
    description: "Hai completato 3 set di curl bicipiti e aumentato il peso a 15kg."
  },
  {
    icon: "ri-award-line",
    iconColor: "bg-accent",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 giorni fa
    title: "Nuovo record personale",
    description: "Hai stabilito un nuovo record di 80kg nella panca piana!"
  },
  {
    icon: "ri-footprint-line",
    iconColor: "bg-green-500",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 giorni fa
    title: "Allenamento gambe",
    description: "Hai completato 4 set di squat e 3 set di pressa."
  }
];

const ActivitySummary = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Attività recenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                iconColor={activity.iconColor}
                timestamp={activity.timestamp}
                title={activity.title}
                description={activity.description}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivitySummary;

