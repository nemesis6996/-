import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Check, MessageSquare, RefreshCw } from "lucide-react";
import { Link } from "wouter";
// import { apiRequest } from "@/lib/queryClient"; // Rimosso perché non utilizzato in questo componente simulato

interface DashboardAiSuggestionsResponse {
  suggestions: string[];
}

export default function AiAssistant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: suggestionsData, isLoading } = useQuery<DashboardAiSuggestionsResponse, Error>({
    queryKey: ["/api/ai/dashboard-suggestions"],
    queryFn: async () => { 
      await new Promise(resolve => setTimeout(resolve, 700));
      return { suggestions: [
        "Oggi potresti concentrarti sulla forza esplosiva.",
        "Non dimenticare l'idratazione durante l'allenamento.",
        "Un buon riscaldamento previene gli infortuni: dedicali almeno 10 minuti."
      ]};
    }
  });

  const { mutate: refreshSuggestions, isPending: isRefreshing } = useMutation<DashboardAiSuggestionsResponse, Error, void>({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { suggestions: [
        "Nuovo suggerimento: prova una sessione di yoga per migliorare la flessibilità.",
        "Nuovo suggerimento: aumenta gradualmente il carico nei tuoi esercizi principali.",
        "Nuovo suggerimento: assicurati di dormire almeno 7-8 ore per un recupero ottimale."
      ]};
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/ai/dashboard-suggestions"], data);
      toast({
        title: "Suggerimenti aggiornati",
        description: "Nuovi suggerimenti generati con successo (simulato)",
      });
    },
    onError: (_error) => {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare i suggerimenti (simulato)",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-heading">Assistente IA</h2>
        <Link href="/ai-assistant"> 
          <Button variant="link" className="text-primary font-semibold text-sm flex items-center">
            <i className="ri-settings-3-line mr-1"></i> Configura
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              </div>
            ) : suggestionsData && suggestionsData.suggestions ? (
              <div className="flex items-start">
                <div className="bg-secondary/20 p-3 rounded-lg mr-5">
                  <i className="ri-robot-line text-2xl text-secondary"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Suggerimenti per oggi</h3>
                  <p className="text-gray-600 mb-4">
                    In base ai tuoi allenamenti recenti, ecco alcuni consigli personalizzati per il tuo prossimo allenamento:
                  </p>
                  {suggestionsData.suggestions.length > 0 ? (
                    <ul className="space-y-2 text-gray-700 mb-4">
                      {suggestionsData.suggestions.map((suggestion: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                          className="flex items-start"
                        >
                          <Check className="text-accent mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 mb-4">Nessun suggerimento disponibile al momento.</p>
                  )}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => refreshSuggestions()}
                      disabled={isRefreshing}
                      className="border-primary text-primary hover:bg-primary/5"
                    >
                      {isRefreshing ? (
                        <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-1 h-4 w-4" />
                      )}
                      Aggiorna
                    </Button>
                    <Link href="/ai-assistant">
                      <Button 
                        asChild
                        className="bg-primary hover:bg-primary-dark text-white"
                      >
                        <a><MessageSquare className="mr-1 h-4 w-4" /> Chiedi all'assistente</a>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Impossibile caricare i suggerimenti.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

