import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle } from "@/lib/firebase";
import { FaGoogle, FaApple } from "react-icons/fa";
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
  FormDescription,
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
  SelectValue
} from "@/components/ui/select";

// Form validation schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username deve contenere almeno 3 caratteri" }),
  email: z.string().email({ message: "Inserisci un indirizzo email valido" }),
  name: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
  password: z.string().min(6, { message: "Password deve contenere almeno 6 caratteri" }),
  confirmPassword: z.string(),
  level: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non corrispondono",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Set up form with validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      level: "Principiante",
    },
  });

  // Form submission handler
  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = data;
      
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante la registrazione");
      }
      
      toast({
        title: "Registrazione completata",
        description: "Account creato con successo. Puoi ora effettuare il login.",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        title: "Errore di registrazione",
        description: error instanceof Error ? error.message : "Si è verificato un errore",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Registrazione con Google
  async function handleGoogleSignup() {
    setIsLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success && result.user) {
        // In una implementazione reale, inviare dati a backend per la registrazione
        toast({
          title: "Account Google collegato",
          description: "Per questa demo, vai al login per accedere con Google",
        });
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(result.error || "Errore durante la registrazione con Google");
      }
    } catch (error) {
      console.error("Errore registrazione Google:", error);
      toast({
        title: "Errore di registrazione con Google",
        description: error instanceof Error ? error.message : "Si è verificato un errore",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Registrazione con Apple (non implementata)
  function handleAppleSignup() {
    toast({
      title: "Registrazione con Apple",
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
          <p className="text-gray-600 mt-2">Registrati per creare il tuo avatar 3D e monitorare i tuoi progressi</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crea un account</CardTitle>
            <CardDescription>
              Inserisci i tuoi dati per creare un nuovo account
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Il tuo indirizzo email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Il tuo nome completo" {...field} />
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
                          <SelectItem value="Principiante">Principiante</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzato">Avanzato</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Seleziona il livello che meglio descrive la tua esperienza con il fitness
                      </FormDescription>
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
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Oppure registrati con</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button 
                variant="outline" 
                className="bg-white border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
                <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                Google
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-white border-gray-300 hover:bg-gray-50"
                onClick={handleAppleSignup}
                disabled={isLoading}
              >
                <FaApple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
            
            <div className="text-sm text-center w-full text-gray-500 mt-4">
              Hai già un account?{" "}
              <Link to="/login">
                <span className="text-primary font-medium hover:underline cursor-pointer">Accedi</span>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
