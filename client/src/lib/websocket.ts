// Client per notifiche - implementazione con HTTP polling
import { store } from "@/store/store";
import { addNotification } from "@/store/user-slice";

let pollingInterval: number | null = null;
const POLLING_INTERVAL = 15000; // 15 secondi

// Inizializza il polling delle notifiche
export function initializeWebSocket() {
  console.log("Inizializzazione sistema di notifiche con polling HTTP");
  
  // Ferma qualsiasi polling precedente
  stopPolling();
  
  // Avvia il polling
  startPolling();
  
  return true;
}

// Funzione per avviare il polling delle notifiche
function startPolling() {
  // Esegui immediatamente la prima richiesta
  fetchNotifications();
  
  // Imposta l'intervallo per le richieste successive
  pollingInterval = window.setInterval(fetchNotifications, POLLING_INTERVAL);
}

// Funzione per fermare il polling
function stopPolling() {
  if (pollingInterval) {
    window.clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

// Funzione per recuperare le notifiche dal server
async function fetchNotifications() {
  try {
    console.log("Richiesta notifiche in corso...");
    
    const response = await fetch('/api/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Necessario per inviare i cookie di autenticazione
    });
    
    if (response.ok) {
      const notification = await response.json();
      console.log("Notifica ricevuta dal server:", notification);
      
      // Aggiungi la notifica allo store Redux
      store.dispatch(
        addNotification({
          text: notification.message,
          time: "Ora",
        })
      );
      
      // Mostra la notifica tramite il sistema di notifiche provocatorie
      if (typeof window.showSassyNotification !== 'undefined') {
        switch(notification.type) {
          case 'missed_workout':
            window.showSassyNotification.missedWorkout?.(notification.severity);
            break;
          case 'decreased_weight':
            window.showSassyNotification.decreasedWeight?.(notification.severity);
            break;
          default:
            // Fallback alla notifica casuale
            window.showSassyNotification.random?.();
            break;
        }
      }
    } else {
      console.warn("Errore nella richiesta delle notifiche:", response.status);
    }
  } catch (error) {
    console.error("Errore durante il polling delle notifiche:", error);
  }
}

// Funzione per inviare messaggi (mantenuta per compatibilità API)
export function sendMessage(message: any) {
  console.log("Invio messaggio non supportato in modalità polling:", message);
  return false;
}

// Funzione per chiudere il polling delle notifiche
export function closeWebSocket() {
  console.log("Chiusura sistema di notifiche");
  stopPolling();
}

// Riavvia il polling quando la pagina ritorna in foreground
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    console.log("Documento tornato visibile, riavvio polling notifiche...");
    initializeWebSocket();
  }
});

export default {
  initializeWebSocket,
  sendMessage,
  closeWebSocket,
};