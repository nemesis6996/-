/**
 * Database di notifiche provocatorie e divertenti per motivare gli utenti
 * Contiene linguaggio esplicito e umorismo irriverente
 */

export interface SassyNotification {
  id: number;
  type: 'missed_workout' | 'decreased_weight' | 'skipped_days' | 'incomplete_sets' | 'achievement' | 'motivation';
  severity: 'light' | 'medium' | 'harsh';
  message: string;
  title: string;
}

const sassyNotifications: SassyNotification[] = [
  // ALLENAMENTI MANCATI
  {
    id: 1,
    type: 'missed_workout',
    severity: 'light',
    title: "Hey, dove sei finito?",
    message: "Il tuo materassino sta piangendo di solitudine. Torni in palestra o dobbiamo venire a prenderti?"
  },
  {
    id: 2,
    type: 'missed_workout',
    severity: 'medium',
    title: "Allenamento? Chi è costui?",
    message: "Il tuo corpo sta dimenticando come si fa a sudare. Quella poltrona ti sta mangiando il culo, muoviti!"
  },
  {
    id: 3,
    type: 'missed_workout',
    severity: 'harsh',
    title: "SVEGLIA C***O!",
    message: "Sei sparito peggio della tua motivazione! Hai paura del ferro o ti sei perso tra il divano e il frigo?"
  },
  
  // DIMINUZIONE DEL PESO
  {
    id: 4,
    type: 'decreased_weight',
    severity: 'light',
    title: "Gravità aumentata oggi?",
    message: "Hai abbassato il peso... le tue braccia hanno chiesto il sindacato o cosa? Dai che puoi fare di meglio!"
  },
  {
    id: 5,
    type: 'decreased_weight',
    severity: 'medium',
    title: "Che succede, campione?",
    message: "Stai sollevando meno di mia nonna, e lei ha 92 anni! Ti sei ammosciato dall'ultima volta!"
  },
  {
    id: 6,
    type: 'decreased_weight',
    severity: 'harsh',
    title: "MA CHE DIAVOLO!",
    message: "Hai abbassato il peso ANCORA?! I pesi non mordono, c***o! O forse le tue braccia hanno deciso di andare in pensione?"
  },
  
  // GIORNI SALTATI
  {
    id: 7,
    type: 'skipped_days',
    severity: 'light',
    title: "Ti sei perso?",
    message: "Sono passati 3 giorni dall'ultimo allenamento. Il tuo corpo sta iniziando a pensare che sei morto!"
  },
  {
    id: 8,
    type: 'skipped_days',
    severity: 'medium',
    title: "Ma dove cavolo sei finito?",
    message: "Una settimana senza allenamento? Gli attrezzi stanno chiedendo se ti sei trasferito sul divano in pianta stabile!"
  },
  {
    id: 9,
    type: 'skipped_days',
    severity: 'harsh',
    title: "DISPERSO IN AZIONE",
    message: "10 giorni di assenza?! Il tuo metabolismo si è addormentato e russa più forte di te! Muovi quel c**o subito!"
  },
  
  // SET INCOMPLETI
  {
    id: 10,
    type: 'incomplete_sets',
    severity: 'light',
    title: "Set a metà?",
    message: "Hai abbandonato i set a metà... la fatica ti ha fatto uno squillo e hai messo giù?"
  },
  {
    id: 11,
    type: 'incomplete_sets',
    severity: 'medium',
    title: "Ti sei arreso?!",
    message: "Set incompleti di nuovo? Le tue scuse pesano più dei tuoi pesi! Forza, non lasciare nulla sul tavolo!"
  },
  {
    id: 12,
    type: 'incomplete_sets',
    severity: 'harsh',
    title: "CHE DELUSIONE!",
    message: "Ma che c***o di allenamento è?! Set incompleti ovunque! Sei venuto in palestra o a fare la passerella? FINISCI QUELLO CHE INIZI!"
  },
  
  // TRAGUARDI
  {
    id: 13,
    type: 'achievement',
    severity: 'light',
    title: "Guarda chi si vede!",
    message: "Hai battuto il tuo record! Non male per un pigrone. La prossima volta alziamo ancora l'asticella, eh?"
  },
  {
    id: 14,
    type: 'achievement',
    severity: 'medium',
    title: "Stai diventando una bestia!",
    message: "Nuovo personal best! Ma guarda te, sembri quasi uno che sa quello che fa! Continua così e diventerai una macchina!"
  },
  {
    id: 15,
    type: 'achievement',
    severity: 'harsh',
    title: "FINALMENTE, CAZZO!",
    message: "Hai superato il tuo record! Era ora! Pensavo ti fossi accontentato di essere mediocre per sempre! CONTINUA COSÌ!"
  },
  
  // MOTIVAZIONE
  {
    id: 16,
    type: 'motivation',
    severity: 'light',
    title: "Le scuse non bruciano calorie",
    message: "I muscoli si ottengono con il sudore, non con i pensieri. Muovi quel sedere e inizia a spaccare!"
  },
  {
    id: 17,
    type: 'motivation',
    severity: 'medium',
    title: "Dove diavolo sei?",
    message: "Il tuo corpo ti sta implorando di dargli una forma! L'unico modo per zittirlo è macinare chilometri e sollevare pesi, quindi muoviti!"
  },
  {
    id: 18,
    type: 'motivation',
    severity: 'harsh',
    title: "BASTA CAZZEGGIARE!",
    message: "Il dolore è temporaneo, essere un mollaccione è per sempre! Fai schifo oggi per non fare schifo domani! ALZATI E COMBATTI!"
  }
];

/**
 * Restituisce una notifica casuale basata sul tipo e la severità
 */
export const getRandomNotification = (
  type: SassyNotification['type'], 
  severity: SassyNotification['severity'] = 'medium'
): SassyNotification => {
  const filtered = sassyNotifications.filter(
    notification => notification.type === type && notification.severity === severity
  );
  
  if (filtered.length === 0) {
    // Fallback se non ci sono notifiche del tipo/severità richiesti
    return sassyNotifications[Math.floor(Math.random() * sassyNotifications.length)];
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)];
};

/**
 * Restituisce una notifica motivazionale casuale
 */
export const getRandomMotivation = (severity: SassyNotification['severity'] = 'medium'): SassyNotification => {
  return getRandomNotification('motivation', severity);
};

export default sassyNotifications;