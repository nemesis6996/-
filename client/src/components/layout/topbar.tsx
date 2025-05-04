import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const notifications = useSelector(
    (state: RootState) => state.user.notifications
  );

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="mr-2" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-2xl font-bold">
                <span className="text-primary">nem</span>muscle
              </SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <div className="px-4 py-2">
                <a href="/" className="flex items-center py-2 px-2 rounded hover:bg-gray-100">
                  <i className="ri-dashboard-line mr-3 text-lg"></i>
                  <span>Dashboard</span>
                </a>
                <a href="/workouts" className="flex items-center py-2 px-2 rounded hover:bg-gray-100">
                  <i className="ri-run-line mr-3 text-lg"></i>
                  <span>Allenamenti</span>
                </a>
                <a href="/exercises" className="flex items-center py-2 px-2 rounded hover:bg-gray-100">
                  <i className="ri-heart-pulse-line mr-3 text-lg"></i>
                  <span>Esercizi</span>
                </a>
                <a href="/programs" className="flex items-center py-2 px-2 rounded hover:bg-gray-100">
                  <i className="ri-calendar-todo-line mr-3 text-lg"></i>
                  <span>Programmi</span>
                </a>
                <a href="/progress" className="flex items-center py-2 px-2 rounded hover:bg-gray-100">
                  <i className="ri-medal-line mr-3 text-lg"></i>
                  <span>Progressi</span>
                </a>
                <a href="/ai-assistant" className="flex items-center py-2 px-2 rounded hover:bg-gray-100">
                  <i className="ri-robot-line mr-3 text-lg"></i>
                  <span>Assistente IA</span>
                </a>
                <a href="/settings" className="flex items-center py-2 px-2 rounded hover:bg-gray-100">
                  <i className="ri-settings-line mr-3 text-lg"></i>
                  <span>Impostazioni</span>
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold font-heading">
          <span className="text-primary">nem</span>muscle
        </h1>
      </div>

      <div className="md:flex hidden items-center">
        <h2 className="text-xl font-bold font-heading">{title}</h2>
      </div>

      <div className="flex items-center space-x-3">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Notifiche">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="border-b p-3">
              <h3 className="font-semibold">Notifiche</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Nessuna notifica
                </div>
              ) : (
                <div>
                  {notifications.map((notification, index) => (
                    <div key={index} className="p-3 border-b hover:bg-gray-50">
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 text-center">
                <button className="text-primary text-sm font-medium">
                  Segna tutte come lette
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <div className="w-9 h-9 rounded-full bg-gray-200 md:hidden flex items-center justify-center overflow-hidden">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-gray-600">
              {user?.name?.charAt(0) || "U"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
