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
// import { Label } from "@/components/ui/label"; // Non utilizzato, rimosso
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
import { RootState, AppDispatch } from "@/store/store"; // Aggiunto AppDispatch
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, Pencil, Save } from "lucide-react";
import type { User } from "@shared/schema"; // Importa User da shared/schema
import { setUser as setUserAction } from "@/store/user-slice"; // Importa l'azione Redux
import { useDispatch } from "react-redux"; // Aggiunto useDispatch

const profileSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
  email: z.string().email({ message: "Inserisci un indirizzo email valido" }),
  level: z.string().optional(),
  profileImage: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>(); // Inizializza dispatch
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      level: user?.level || "Principiante",
      profileImage: user?.profileImage || "",
    },
    // Ricarica i valori del form quando l'utente cambia (es. dopo il login)
    values: user ? {
      name: user.name || "",
      email: user.email || "",
      level: user.level || "Principiante",
      profileImage: user.profileImage || "",
    } : undefined,
  });

  const { mutate: updateProfile, isPending } = useMutation<User, Error, ProfileFormValues>({
    mutationFn: async (data: ProfileFormValues) => {
      if (!user?.id) throw new Error("ID utente non disponibile per l'aggiornamento.");
      // La risposta da apiRequest è una Response, quindi devi fare .json()
      const response = await apiRequest("PUT", `/api/users/${user.id}`, data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Errore sconosciuto durante l'aggiornamento del profilo." }));
        throw new Error(errorData.message || "Errore durante l'aggiornamento del profilo.");
      }
      return response.json();
    },
    onSuccess: (updatedUserData) => { // updatedUserData è di tipo User
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      dispatch(setUserAction(updatedUserData)); // Aggiorna lo store Redux con i dati aggiornati
      toast({
        title: "Profilo aggiornato",
        description: "Le tue informazioni sono state aggiornate con successo",
      });
      setIsEditingProfile(false);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message || "Impossibile aggiornare il profilo. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

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
                        alt={user.name || "User avatar"} // Aggiunto fallback per alt
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-400">
                        {user?.name?.charAt(0).toUpperCase() || "U"} {/* Aggiunto toUpperCase */}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">{user?.name || "Nome Utente"}</h1>
                  <p className="text-gray-500">{user?.email || "email@example.com"}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {user?.level || "Principiante"}
                    </span>
                    {/* Dati fittizi, da sostituire con dati reali se disponibili */}
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
                      {user?.avatarData?.url ? ( // Controlla user.avatarData.url
                        <div className="relative w-full h-full">
                           <img src={user.avatarData.url} alt="Avatar 3D" className="w-full h-full object-contain"/>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-sm text-gray-500">Nessun avatar</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {user?.avatarData?.url ? "Il tuo avatar 3D" : "Crea il tuo avatar 3D"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {user?.avatarData?.url 
                          ? `Ultimo aggiornamento: ${user.avatarLastUpdated ? new Date(user.avatarLastUpdated).toLocaleDateString("it-IT") : "Mai"}`
                          : "Effettua una scansione per creare il tuo avatar personalizzato"
                        }
                      </p>
                      <Button asChild>
                        <a href="/avatar-3d">
                          {user?.avatarData?.url ? "Gestisci avatar" : "Crea avatar"}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Statistiche fittizie, da popolare con dati reali */}
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-lg">Allenamenti Totali</CardTitle></CardHeader>
                  <CardContent><div className="flex items-baseline"><span className="text-3xl font-bold mr-2">0</span><span className="text-sm text-gray-500">allenamenti</span></div></CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-lg">Calorie Bruciate</CardTitle></CardHeader>
                  <CardContent><div className="flex items-baseline"><span className="text-3xl font-bold mr-2">0</span><span className="text-sm text-gray-500">kcal</span></div></CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-lg">Tempo Totale</CardTitle></CardHeader>
                  <CardContent><div className="flex items-baseline"><span className="text-3xl font-bold mr-2">0</span><span className="text-sm text-gray-500">ore</span></div></CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Impostazioni Account</CardTitle>
                  <CardDescription>Gestisci le impostazioni del tuo account (funzionalità in sviluppo).</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">Impostazioni account in arrivo!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferenze Utente</CardTitle>
                  <CardDescription>Personalizza la tua esperienza (funzionalità in sviluppo).</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">Opzioni di preferenza in arrivo!</p>
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

