import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type AdminSidebarProps = {
  activeItem?: string;
}

export default function AdminSidebar({ activeItem }: AdminSidebarProps) {
  const [location] = useLocation();
  const user = useSelector((state: RootState) => state.user.user);

  // Verifica che l'utente sia admin
  if (!user || user.role !== "admin") {
    return null;
  }

  const adminMenuItems = [
    { path: "/admin", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/admin/users", label: "Utenti", icon: "ri-user-settings-line" },
    { path: "/admin/exercises", label: "Esercizi", icon: "ri-heart-pulse-line" },
    { path: "/admin/workouts", label: "Schede", icon: "ri-run-line" },
    { path: "/admin/programs", label: "Programmi", icon: "ri-calendar-todo-line" },
    { path: "/admin/notifications", label: "Notifiche", icon: "ri-notification-4-line" },
    { path: "/admin/stats", label: "Statistiche", icon: "ri-line-chart-line" },
  ];

  return (
    <aside className="hidden lg:flex flex-col bg-gray-50 border-r border-gray-200 w-64 z-10">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Amministrazione</h2>
        <p className="text-sm text-gray-500">Gestione piattaforma</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {adminMenuItems.map((item) => (
            <div key={item.path}>
              <Link href={item.path}>
                <div
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                    (location === item.path || activeItem === item.label.toLowerCase())
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:text-primary hover:bg-primary/10"
                  )}
                >
                  <i className={`${item.icon} mr-3 text-lg`}></i>
                  {item.label}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div>
          <Link href="/">
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 rounded-md cursor-pointer">
              <i className="ri-arrow-left-line mr-3 text-lg"></i>
              Torna alla dashboard
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}