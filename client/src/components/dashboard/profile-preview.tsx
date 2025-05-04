import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Edit, Award, ChevronRight } from "lucide-react";

const ProfilePreview = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const avatarCustomizations = useSelector((state: RootState) => state.avatar.customizations);
  
  // Trova l'avatar primario o usa il primo disponibile
  const mainAvatar = avatarCustomizations?.find(a => a.isPrimary) || avatarCustomizations?.[0];
  
  if (!user) return null;
  
  // Calcola il livello dell'utente (esempio semplice)
  const userLevel = {
    current: 3,
    exp: 2450,
    nextLevel: 3000,
    progress: 82 // percentuale di completamento
  };
  
  const achievements = [
    { name: "Prime 5 sessioni", completed: true },
    { name: "Allenamento costante", completed: true },
    { name: "Squat 80kg", completed: false }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8"
    >
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-indigo-600" />
        <CardContent className="pt-0 relative">
          <div className="flex flex-col md:flex-row -mt-12 md:-mt-16 items-center md:items-start">
            <div className="z-10 rounded-full p-1 bg-white shadow-md">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white">
                {mainAvatar?.previewUrl ? (
                  <AvatarImage src={mainAvatar.previewUrl} />
                ) : (
                  <AvatarImage src={user.profileImage || "https://picsum.photos/200"} />
                )}
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0) || user.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold font-heading">{user.name}</h2>
                  <p className="text-gray-600 text-sm">@{user.username}</p>
                </div>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifica
                  </Button>
                </Link>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Badge variant="secondary" className="mr-2">Liv. {userLevel.current}</Badge>
                    <span className="text-sm text-gray-600">{userLevel.exp} / {userLevel.nextLevel} XP</span>
                  </div>
                  <span className="text-xs text-gray-500">+550 XP questa settimana</span>
                </div>
                <Progress value={userLevel.progress} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold">Obiettivi raggiunti</h3>
            </div>
            
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${achievement.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={achievement.completed ? 'text-gray-900' : 'text-gray-500'}>
                      {achievement.name}
                    </span>
                  </div>
                  {achievement.completed && (
                    <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Completato
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            <Link to="/progress">
              <Button variant="ghost" className="w-full mt-4 text-primary justify-between">
                <span>Vedi tutti gli obiettivi</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePreview;