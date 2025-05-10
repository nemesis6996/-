import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query"; // Rimosso useQueryClient se non usato
// import { apiRequest } from "@/lib/queryClient"; // Rimosso se non utilizzato
import { useToast } from "@/hooks/use-toast";
import { Check, Send, MessageSquare, RefreshCw, Sparkles, Dumbbell, Brain, Calendar } from "lucide-react";
import { AiSuggestion } from "@shared/schema"; // Assicurati che il percorso sia corretto e l'interfaccia sia esportata
import { askAiAssistant } from "@/lib/ai-assistant";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Ciao! Sono il tuo assistente fitness personale. Come posso aiutarti oggi?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // const queryClient = useQueryClient(); // Rimosso se non utilizzato per invalidazioni
  const { toast } = useToast();
  
  // Fetch AI suggestions
  const { data: suggestions } = useQuery<AiSuggestion>({
    queryKey: ["/api/ai/suggestions"], // Questo probabilmente dovrebbe chiamare una funzione che usa apiRequest
    // queryFn: async () => apiRequest("GET", "/api/ai/suggestions") // Esempio di come potrebbe essere usato apiRequest
    // Per ora, assumiamo che i dati siano mockati o gestiti diversamente se apiRequest non è usato qui.
  });
  
  // Mutation to ask AI assistant
  const { mutate: askAi, isPending: isAiThinking } = useMutation({
    mutationFn: async (query: string) => {
      return await askAiAssistant(query);
    },
    onSuccess: (data) => {
      const aiResponse: Message = {
        id: Date.now().toString(),
        content: data.response, // Assumendo che la risposta dell'AI sia in data.response
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    },
    onError: (err: Error) => { // Aggiunto tipo per err
      console.error("AI Assistant error:", err);
      toast({
        title: "Errore Assistente IA",
        description: err.message || "Impossibile ottenere una risposta dall'assistente. Riprova più tardi.",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    askAi(inputMessage);
  };
  
  // Quick question templates
  const quickQuestions = [
    {
      text: "Come posso migliorare i miei squat?",
      icon: <Dumbbell className="h-4 w-4 mr-2" />,
    },
    {
      text: "Quante calorie dovrei bruciare al giorno?",
      icon: <Sparkles className="h-4 w-4 mr-2" />,
    },
    {
      text: "Suggerisci un allenamento per le braccia",
      icon: <Calendar className="h-4 w-4 mr-2" />,
    },
    {
      text: "Come recuperare dopo un allenamento intenso?",
      icon: <Brain className="h-4 w-4 mr-2" />,
    },
  ];
  
  // Handle quick question click
  const handleQuickQuestion = (question: string) => {
    // Non impostare inputMessage qui, altrimenti l'utente lo vede prima dell'invio
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    // setInputMessage(""); // Non serve se non è stato impostato
    setIsTyping(true);
    
    askAi(question);
  };
  
  return (
    <div className="flex h-screen bg-lightBg">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <TopBar title="Assistente IA" />
        
        <div className="flex-1 flex p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col md:flex-row w-full h-full gap-4">
            {/* Sidebar with Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="md:w-72 lg:w-80 flex-shrink-0"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    Suggerimenti
                  </CardTitle>
                  <CardDescription>
                    Consigli personalizzati basati sui tuoi allenamenti
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {suggestions?.suggestions?.map((suggestion: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                        className="p-3 bg-secondary/5 rounded-lg"
                      >
                        <div className="flex">
                          <Check className="text-accent mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      </motion.div>
                    ))}
                    {!suggestions?.suggestions && <p className="text-sm text-gray-500">Nessun suggerimento disponibile al momento.</p>}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Domande rapide</h3>
                    <div className="space-y-2">
                      {quickQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-2 px-3 leading-snug"
                          onClick={() => handleQuickQuestion(question.text)}
                        >
                          {question.icon}
                          <span className="truncate whitespace-normal">{question.text}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b flex items-center">
                <div className="bg-secondary/20 p-2 rounded-lg mr-3">
                  <MessageSquare className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="font-semibold">Assistente Fitness</h2>
                  <p className="text-xs text-gray-500">Alimentato da intelligenza artificiale</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        message.sender === "user"
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`text-xs mt-1 text-right ${
                          message.sender === "user" ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-3/4 p-3 bg-gray-100 text-gray-800 rounded-lg rounded-tl-none shadow-sm">
                      <div className="flex space-x-1.5 items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSubmit} className="border-t p-3 md:p-4 bg-gray-50">
                <div className="flex items-center">
                  <Input
                    placeholder="Scrivi un messaggio..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isAiThinking || isTyping}
                    className="flex-1 mr-2"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        handleSubmit(e as any); // Potrebbe servire un cast o una gestione più precisa dell'evento
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-primary hover:bg-primary-dark text-white flex-shrink-0"
                    disabled={isAiThinking || isTyping || !inputMessage.trim()}
                  >
                    {isAiThinking || isTyping ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}

