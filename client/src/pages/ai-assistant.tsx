import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Rimosso perché non utilizzato
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Send } from "lucide-react"; // Sostituito PaperPlaneIcon con Send da lucide-react
import { useToast } from "@/hooks/use-toast";

// Interfaccia per un singolo messaggio nella chat
interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// Interfaccia per la risposta simulata dell_AI
interface AiResponse {
  answer: string;
  followUpQuestions?: string[];
}

const AiAssistantPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simula una risposta dall_AI
  const getAiResponse = async (userMessage: string): Promise<AiResponse> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsLoading(false);

    let answer = "Non sono sicuro di come rispondere. Puoi riformulare la domanda?";
    let followUpQuestions: string[] = [
      "Qual è il tuo obiettivo principale di fitness?",
      "Hai preferenze per allenamenti a corpo libero o con attrezzi?",
      "Quanto tempo hai a disposizione per allenarti oggi?"
    ];

    if (userMessage.toLowerCase().includes("allenamento")) {
      answer = "Certo, posso aiutarti a creare un allenamento! Che tipo di allenamento stai cercando? Ad esempio, per tutto il corpo, parte superiore, o gambe?";
      followUpQuestions = [
        "Quali gruppi muscolari vuoi allenare?",
        "Hai attrezzi specifici a disposizione?",
        "Quanto tempo vuoi dedicare all_allenamento?"
      ];
    } else if (userMessage.toLowerCase().includes("dieta") || userMessage.toLowerCase().includes("nutrizione")) {
      answer = "Posso darti dei consigli generali sulla nutrizione. Ricorda che per un piano alimentare personalizzato dovresti consultare un professionista. Cosa ti interessa sapere in particolare?";
      followUpQuestions = [
        "Stai cercando di perdere peso, mantenere o aumentare la massa muscolare?",
        "Hai qualche restrizione alimentare?",
        "Quali sono i tuoi cibi preferiti?"
      ];
    } else if (userMessage.toLowerCase().includes("ciao") || userMessage.toLowerCase().includes("salve")) {
      answer = "Ciao! Come posso aiutarti oggi con i tuoi obiettivi di fitness?";
    }

    return { answer, followUpQuestions };
  };

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const aiResponse = await getAiResponse(userMessage.text);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: aiResponse.answer,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      if (aiResponse.followUpQuestions && aiResponse.followUpQuestions.length > 0) {
        console.log("Follow-up questions:", aiResponse.followUpQuestions);
      }

    } catch (error) {
      toast({
        title: "Errore Assistente AI",
        description: "Si è verificato un errore durante la comunicazione con l_assistente.",
        variant: "destructive",
      });
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "Spiacente, non sono riuscito a elaborare la tua richiesta. Riprova più tardi.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-var(--header-height)-var(--footer-height))]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h1 className="text-3xl font-bold font-heading">Assistente AI NemFit</h1>
        <p className="text-muted-foreground">
          Chiedimi qualsiasi cosa riguardo ai tuoi allenamenti, nutrizione o obiettivi di fitness!
        </p>
      </motion.div>

      <div className="flex-grow overflow-y-auto bg-muted/30 p-4 rounded-lg shadow-inner mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            <i className="ri-question-answer-line text-4xl mb-2"></i>
            <p>Nessun messaggio ancora. Inizia una conversazione!</p>
          </div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: msg.sender === "user" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow ${ 
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0}} 
            animate={{ opacity: 1}} 
            className="flex justify-start"
          >
            <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow bg-background border">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-75"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></div>
                <span className="text-sm text-muted-foreground">L_AI sta pensando...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 sticky bottom-0 bg-background py-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi il tuo messaggio..."
          className="flex-grow resize-none p-3 border rounded-lg focus:ring-2 focus:ring-primary transition-shadow duration-150"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <Button type="submit" size="icon" className="h-12 w-12" disabled={isLoading || !input.trim()}>
          <Send className="h-5 w-5" /> {/* Usata icona Send */}
          <span className="sr-only">Invia</span>
        </Button>
      </form>
    </div>
  );
};

export default AiAssistantPage;

