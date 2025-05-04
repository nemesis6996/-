import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
  { path: "/exercises", label: "Esercizi", icon: "ri-heart-pulse-line" },
  { path: "/avatar-3d", label: "Avatar 3D", icon: "ri-body-scan-line" },
  { path: "/programs", label: "Programmi", icon: "ri-calendar-todo-line" },
  { path: "/progress", label: "Progressi", icon: "ri-medal-line" },
];

export default function MobileNavigation() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md border-t z-10">
      <div className="flex justify-around items-center py-3 px-2">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a
              className={cn(
                "mobile-nav-item flex flex-col items-center",
                location === item.path && "active"
              )}
            >
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
