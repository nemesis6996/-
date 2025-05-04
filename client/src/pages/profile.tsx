import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, Pencil, Save } from "lucide-react";

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
  email: z.string().email({ message: "Inserisci un indirizzo email valido" }),
  level: z.string().optional(),
  profileImage: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const user = useSelector((state: RootState) => state.user.user);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Set up form with default values from user state
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      level: user?.level || "Principiante",
      profileImage: user?.profileImage || "",
    },
  });

  // Mutation for updating profile
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", `/api/users/${user?.id}`, data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profilo aggiornato",
        description: "Le tue informazioni sono state aggiornate con successo",
      });
      setIsEditingProfile(false);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il profilo. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: ProfileFormValues) {
    updateProfile(data);
  }

  return (
    <div className="flex h-screen bg-lightBg">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <TopBar title="Profilo" />
        
        <div className="p-4 md:p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profilo</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferenze</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center md:flex-row md:items-start gap-6 p-6 bg-white rounded-lg shadow-sm"
              >
                <div className="relative">
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-400">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <p className="text-gray-500">{user?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {user?.level || "Principiante"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      24 Allenamenti
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      Con FitPro dal 2023
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="ml-auto hidden md:flex"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Salva Modifiche
                    </>
                  ) : (
                    <>
                      <Pencil className="mr-2 h-4 w-4" /> Modifica Profilo
                    </>
                  )}
                </Button>
              </motion.div>
              
              {/* Profile Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Informazioni Personali</CardTitle>
                    <CardDescription>
                      Aggiorna le tue informazioni personali
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Il tuo nome" 
                                  {...field} 
                                  disabled={!isEditingProfile}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Il tuo indirizzo email" 
                                  {...field} 
                                  disabled={!isEditingProfile}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Livello</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Il tuo livello di esperienza" 
                                  {...field} 
                                  disabled={!isEditingProfile}
                                />
                              </FormControl>
                              <FormDescription>
                                Principiante, Intermedio o Avanzato
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {isEditingProfile && (
                          <div className="flex justify-end">
                            <Button 
                              type="submit" 
                              className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white"
                              disabled={isPending}
                            >
                              {isPending ? (
                                <span className="flex items-center">
                                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></span>
                                  Salvataggio...
                                </span>
                              ) : (
                                "Salva Modifiche"
                              )}
                            </Button>
                          </div>
                        )}
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-between md:hidden">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="w-full"
                    >
                      {isEditingProfile ? "Annulla" : "Modifica"}
                    </Button>
                    {isEditingProfile && (
                      <Button 
                        className="w-full ml-2 bg-primary hover:bg-primary-dark text-white"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isPending}
                      >
                        {isPending ? "Salvataggio..." : "Salva"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Avatar 3D Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Avatar 3D</CardTitle>
                    <CardDescription>
                      Il tuo avatar 3D personalizzato per monitorare i progressi fisici
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      {user?.avatarData ? (
                        <div className="relative w-full h-full">
                          {/* Qui verrebbe visualizzato l'avatar 3D con una libreria come Three.js */}
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg">
                            <span className="text-primary font-bold">Avatar 3D</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-sm text-gray-500">Nessun avatar</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {user?.avatarData ? "Il tuo avatar 3D" : "Crea il tuo avatar 3D"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {user?.avatarData 
                          ? `Ultimo aggiornamento: ${user.avatarLastUpdated ? new Date(user.avatarLastUpdated).toLocaleDateString('it-IT') : 'Mai'}`
                          : "Effettua una scansione per creare il tuo avatar personalizzato"
                        }
                      </p>
                      <Button asChild>
                        <a href="/avatar-3d">
                          {user?.avatarData ? "Gestisci avatar" : "Crea avatar"}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Allenamenti Totali</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold mr-2">124</span>
                      <span className="text-sm text-gray-500">allenamenti</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Calorie Bruciate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold mr-2">48,290</span>
                      <span className="text-sm text-gray-500">kcal</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Tempo Totale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold mr-2">102</span>
                      <span className="text-sm text-gray-500">ore</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Impostazioni Account</CardTitle>
                  <CardDescription>
                    Gestisci le impostazioni del tuo account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Password attuale</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nuova password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Conferma password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    Salva modifiche
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferenze</CardTitle>
                  <CardDescription>
                    Personalizza la tua esperienza
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-center py-8 text-gray-500">
                    Sezione preferenze in arrivo presto.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}
