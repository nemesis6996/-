import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatNumber } from "@/lib/utils";

interface StatItemProps {
  icon: string;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: number | string;
  delay: number;
}

function StatItem({ icon, iconColor, iconBgColor, label, value, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-lg shadow p-4"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <i className={`${icon} text-xl ${iconColor}`}></i>
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-bold font-heading">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const stats = useSelector((state: RootState) => state.user.stats);

  const statItems = [
    {
      icon: "ri-fire-line",
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      label: "Calorie bruciate",
      value: formatNumber(stats.calories),
    },
    {
      icon: "ri-time-line",
      iconColor: "text-secondary",
      iconBgColor: "bg-secondary/10",
      label: "Minuti attivi",
      value: formatNumber(stats.activeMinutes),
    },
    {
      icon: "ri-footprint-line",
      iconColor: "text-accent",
      iconBgColor: "bg-accent/10",
      label: "Allenamenti",
      value: formatNumber(stats.workouts),
    },
    {
      icon: "ri-heart-pulse-line",
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
      label: "Esercizi completati",
      value: formatNumber(stats.exercises),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <StatItem
          key={index}
          icon={item.icon}
          iconColor={item.iconColor}
          iconBgColor={item.iconBgColor}
          label={item.label}
          value={item.value}
          delay={0.1 + index * 0.05}
        />
      ))}
    </div>
  );
}
