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
import { signInWithGoogle } from "@/lib/firebase";
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

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username deve contenere almeno 3 caratteri" }),
  password: z.string().min(6, { message: "Password deve contenere almeno 6 caratteri" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation(); // Corretto: navigate da useLocation, location non usata
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      console.log("Tentativo di login con:", { username: data.username });
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante il login");
      }
      
      const userData: User = await res.json(); // Tipizza userData come User
      console.log("Login riuscito, dati utente:", userData);
      
      store.dispatch(setUser(userData));
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      localStorage.setItem("nemmuscle_user", JSON.stringify(userData));
      
      toast({
        title: "Login effettuato",
        description: "Benvenuto su nemmuscle",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Errore durante il login:", error);
      toast({
        title: "Errore di login",
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
      const result: AuthResponse = await signInWithGoogle(); // signInWithGoogle restituisce AuthResponse
      
      if (result && result.success && result.user) {
        // Qui dovresti inviare result.user al tuo backend per creare/aggiornare l'utente
        // e poi ottenere l'utente completo dal tuo backend, che includerà l'ID del database, ecc.
        // Per ora, simuliamo il login con l'utente demo se l'autenticazione Google ha successo.
        store.dispatch(setUser(result.user)); // Salva l'utente Google nello store (potrebbe essere parziale)
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        localStorage.setItem("nemmuscle_user", JSON.stringify(result.user));

        toast({
          title: "Login con Google effettuato",
          // Assicurati che `name` esista su `result.user` o fornisci un fallback
          description: `Benvenuto ${result.user.name || result.user.username || "Utente Google"}!`,
        });
        
        // Reindirizza alla dashboard o alla pagina del profilo
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
      // Fallback a demo non più necessario se l'autenticazione Google fallisce con un errore chiaro
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
            <CardTitle>Accedi</CardTitle>
            <CardDescription>
              Inserisci le tue credenziali per accedere al tuo account
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
                        <Input placeholder="Il tuo username" {...field} />
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
                        <Input type="password" placeholder="La tua password" {...field} />
                      </FormControl>
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
                      Accesso in corso...
                    </span>
                  ) : (
                    "Accedi"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500 mb-2">
              Non hai un account?{" "}
              <Link to="/register">
                <span className="text-primary font-medium hover:underline cursor-pointer">Registrati</span>
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
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => {
                form.setValue("username", "demo");
                form.setValue("password", "password");
                form.handleSubmit(onSubmit)();
              }}
              disabled={isLoading}
            >
              Accedi con account demo
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

