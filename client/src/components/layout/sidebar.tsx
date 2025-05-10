import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { LogOut } from "lucide-react"; // Rimosso Settings perché non utilizzato direttamente qui, ma tramite l'icona ri-settings-line
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
  { path: "/workouts", label: "Allenamenti", icon: "ri-run-line" },
  { path: "/exercises", label: "Esercizi", icon: "ri-heart-pulse-line" },
  { path: "/programs", label: "Programmi", icon: "ri-calendar-todo-line" },
  { path: "/progress", label: "Progressi", icon: "ri-medal-line" },
  { path: "/avatar-3d", label: "Avatar 3D", icon: "ri-body-scan-line" },
  { path: "/ai-assistant", label: "Assistente IA", icon: "ri-robot-line" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const user = useSelector((state: RootState) => state.user.user);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/login"; // O usa il router di wouter per navigare
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile effettuare il logout. Riprova più tardi.",
        variant: "destructive",
      });
    }
  };

  return (
    <aside className="hidden md:flex flex-col bg-white shadow-md z-10 w-64 h-full fixed left-0 top-0 bottom-0">
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b h-16">
        <Link href="/">
          <h1 className="text-2xl font-bold font-heading text-darkBg cursor-pointer">
            <span className="text-primary">nem</span>muscle
          </h1>
        </Link>
      </div>
      
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mt-2 space-y-1">
          {menuItems.map((item) => (
            <div key={item.path}>
              <Link href={item.path}>
                <div
                  className={cn(
                    "sidebar-item pl-4 py-3 flex items-center space-x-3 rounded cursor-pointer hover:bg-gray-100 transition-colors",
                    location === item.path && "bg-primary/10 text-primary font-medium border-l-4 border-primary pl-3"
                  )}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span>{item.label}</span>
                </div>
              </Link>
            </div>
          ))}
          
          <div>
            <Link href="/settings">
              <div
                className={cn(
                  "sidebar-item pl-4 py-3 flex items-center space-x-3 rounded cursor-pointer hover:bg-gray-100 transition-colors",
                  location === "/settings" && "bg-primary/10 text-primary font-medium border-l-4 border-primary pl-3"
                )}
              >
                <i className="ri-settings-line text-lg"></i>
                <span>Impostazioni</span>
              </div>
            </Link>
          </div>
          
          {/* Admin link (mostrato solo per utenti admin) */}
          {user?.role === "admin" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/admin">
                <div
                  className={cn(
                    "sidebar-item pl-4 py-3 flex items-center space-x-3 rounded cursor-pointer hover:bg-gray-100 transition-colors",
                    location === "/admin" && "bg-red-100 text-red-700 font-medium border-l-4 border-red-500 pl-3"
                  )}
                >
                  <i className="ri-admin-line text-lg"></i>
                  <span>Amministrazione</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* User Profile */}
      <div className="mt-auto p-4 border-t flex items-center space-x-3 h-20">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name || user.username || "User Avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-gray-600">
              {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{user?.name || user?.username || "Utente"}</p>
          {/* <p className="text-xs text-gray-500 truncate">{user?.level || "Principiante"}</p> */}
        </div>
        <button 
          onClick={handleLogout}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

