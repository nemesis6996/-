import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import WelcomeSection from "@/components/dashboard/welcome-section";
import StatsSection from "@/components/dashboard/stats-section";
import TodaysWorkout from "@/components/dashboard/todays-workout";
import AiAssistant from "@/components/dashboard/ai-assistant";
import ActivityChart from "@/components/dashboard/activity-chart";
import GoalProgress from "@/components/dashboard/goal-progress";
import ProfilePreview from "@/components/dashboard/profile-preview";
import ActivitySummary from "@/components/dashboard/activity-summary";
import NotificationTester from "@/components/dashboard/notification-tester";
import { useQuery } from "@tanstack/react-query";
import { Exercise, Program } from "@shared/schema";
import ExerciseCard from "@/components/dashboard/exercise-card";
import ProgramCard from "@/components/dashboard/program-card";
import { Link } from "wouter";
// import { useSelector } from "react-redux"; // Rimosso se isAuthenticated non è usato
// import { RootState } from "@/store/store"; // Rimosso se isAuthenticated non è usato
// import { motion } from "framer-motion"; // Rimosso perché non utilizzato

export default function Dashboard() {
  // const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated); // Rimosso se non utilizzato

  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const { data: programs } = useQuery<Program[]>({
    queryKey: ["/api/programs/templates"],
  });

  return (
    <div className="flex h-screen bg-lightBg">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <TopBar title="Dashboard" />
        
        <div className="p-4 md:p-6">
          <WelcomeSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ActivityChart />
            </div>
            <div>
              <GoalProgress />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <ProfilePreview />
            </div>
            <div className="lg:col-span-2">
              <ActivitySummary />
            </div>
          </div>
          
          <StatsSection />
          <TodaysWorkout />
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-heading">Esercizi recenti</h2>
              <Link to="/exercises">
                <span className="text-primary font-semibold text-sm cursor-pointer">Vedi tutti</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {exercises?.slice(0, 3).map((exercise, index) => (
                <ExerciseCard 
                  key={exercise.id}
                  exercise={exercise}
                  delay={0.1 + index * 0.1}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-heading">Programmi consigliati</h2>
              <Link to="/programs">
                <span className="text-primary font-semibold text-sm cursor-pointer">Esplora tutti</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {programs?.slice(0, 2).map((program, index) => (
                <ProgramCard 
                  key={program.id}
                  program={program}
                  delay={0.1 + index * 0.1}
                />
              ))}
            </div>
          </div>
          
          <NotificationTester />
          <AiAssistant />
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}

