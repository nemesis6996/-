import { useState } from "react";
import { Link, useLocation } from "wouter"; // useLocation fornisce navigate
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient"; // Non utilizzato, rimosso
import { useQueryClient } from "@tanstack/react-query";
import { setUser } from "@/store/user-slice";
import { store } from "@/store/store";
import { signInWithGoogle } from "@/lib/firebase"; // Assicurati che questa funzione esista e restituisca AuthResponse
import { FaGoogle, FaApple } from "react-icons/fa";
import type { User, AuthResponse } from "@shared/schema"; // Importa User e AuthResponse
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username deve contenere almeno 3 caratteri" }),
  email: z.string().email({ message: "Inserisci un indirizzo email valido" }),
  password: z.string().min(6, { message: "Password deve contenere almeno 6 caratteri" }),
  confirmPassword: z.string().min(6, { message: "Conferma password deve contenere almeno 6 caratteri" }),
  level: z.enum(["beginner", "intermediate", "advanced"], { message: "Seleziona un livello di esperienza" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, navigate] = useLocation(); // Corretto: navigate da useLocation, location non usata
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      level: "beginner",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      console.log("Tentativo di registrazione con:", data);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante la registrazione");
      }
      
      const userData: User = await res.json(); // Tipizza userData come User
      console.log("Registrazione riuscita, dati utente:", userData);
      
      store.dispatch(setUser(userData));
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      localStorage.setItem("nemmuscle_user", JSON.stringify(userData));
      
      toast({
        title: "Registrazione effettuata",
        description: "Benvenuto su nemmuscle!",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      toast({
        title: "Errore di registrazione",
        description: error instanceof Error ? error.message : "Si è verificato un errore sconosciuto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      const result: AuthResponse = await signInWithGoogle();
      
      if (result && result.success && result.user) {
        store.dispatch(setUser(result.user));
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        localStorage.setItem("nemmuscle_user", JSON.stringify(result.user));

        toast({
          title: "Login con Google effettuato",
          description: `Benvenuto ${result.user.name || result.user.username || "Utente Google"}! Completa il tuo profilo se necessario.`,
        });
        
        navigate("/"); 

      } else {
        const errorMessage = result?.error ? (typeof result.error === 'string' ? result.error : (result.error as any)?.message) : "Errore durante il login con Google";
        throw new Error(errorMessage || "Errore sconosciuto durante il login con Google");
      }
    } catch (error) {
      console.error("Errore login Google:", error);
      toast({
        title: "Errore di login con Google",
        description: error instanceof Error ? error.message : "Si è verificato un errore sconosciuto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  function handleAppleLogin() {
    toast({
      title: "Login con Apple",
      description: "Funzionalità in arrivo presto!",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading">
            <span className="text-primary">nem</span>muscle
          </h1>
          <p className="text-gray-600 mt-2">Il tuo fitness tracker con avatar 3D</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registrati</CardTitle>
            <CardDescription>
              Crea un nuovo account per iniziare il tuo percorso fitness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Scegli un username" {...field} />
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
                        <Input type="email" placeholder="La tua email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Crea una password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conferma Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Conferma la password" {...field} />
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
                      <FormLabel>Livello di esperienza</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona il tuo livello" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Principiante</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzato</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></span>
                      Registrazione in corso...
                    </span>
                  ) : (
                    "Registrati"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500 mb-2">
              Hai già un account?{" "}
              <Link to="/login">
                <span className="text-primary font-medium hover:underline cursor-pointer">Accedi</span>
              </Link>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Oppure continua con</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button 
                variant="outline" 
                className="bg-white border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                Google
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-white border-gray-300 hover:bg-gray-50"
                onClick={handleAppleLogin}
                disabled={isLoading}
              >
                <FaApple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

