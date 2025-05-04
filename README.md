# Fitness Tracker (React + Vite + Firebase)

Questo è un progetto Fitness Tracker ricostruito utilizzando un moderno stack tecnologico come specificato.

## Stack Tecnologico

*   **Frontend:** React + Vite + TypeScript + Tailwind CSS
*   **Autenticazione:** Firebase Authentication (Google Sign-In, Apple Sign-In)
*   **Database:** Firebase Firestore
*   **Backend API:** Firebase Functions (con Express.js)
*   **Styling:** Tailwind CSS + shadcn/ui (componenti UI copiati dal progetto precedente)
*   **State Management:** Redux Toolkit (copiato dal progetto precedente)
*   **Data Fetching:** React Query (copiato dal progetto precedente)
*   **Routing:** Wouter (copiato dal progetto precedente)
*   **Deployment:** Netlify (configurato tramite `netlify.toml`)
*   **Versionamento:** Git + GitHub

## Struttura del Progetto

```
/fitness_tracker_new
├── client/             # Frontend React (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/ # Componenti UI (inclusi shadcn/ui)
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utilità, config Firebase, servizi Firestore
│   │   ├── pages/      # Pagine dell'applicazione
│   │   ├── store/      # Redux store
│   │   ├── App.tsx     # Componente principale App
│   │   ├── main.tsx    # Entry point React
│   │   └── index.css   # Stili globali e direttive Tailwind
│   ├── .env.local    # Credenziali Firebase (DA COMPILARE)
│   ├── .env.example  # Esempio variabili d'ambiente
│   ├── index.html
│   ├── package.json
│   ├── netlify.toml  # Configurazione Netlify (spostato alla root)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── functions/          # Backend Firebase Functions
│   ├── src/
│   │   └── index.ts    # Entry point Express API
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
├── netlify.toml      # Configurazione Netlify (posizione corretta)
└── README.md         # Questo file
```

*(Nota: `netlify.toml` è stato spostato nella root per una corretta configurazione)*

## Setup e Installazione

1.  **Clona il Repository:**
    ```bash
    git clone <URL_DEL_TUO_REPOSITORY>
    cd fitness_tracker_new
    ```

2.  **Configura le Credenziali Firebase:**
    *   Crea un progetto Firebase su [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Abilita i seguenti servizi:
        *   Authentication (con provider Google e Apple)
        *   Firestore Database
        *   Firebase Functions
    *   Vai su Impostazioni Progetto > Generale > Le tue app.
    *   Registra una nuova applicazione web.
    *   Copia l'oggetto `firebaseConfig` fornito.
    *   Rinomina il file `client/.env.example` in `client/.env.local`.
    *   Incolla i valori corrispondenti dall'oggetto `firebaseConfig` nel file `client/.env.local`:
        ```env
        VITE_FIREBASE_API_KEY=TUO_API_KEY
        VITE_FIREBASE_AUTH_DOMAIN=TUO_AUTH_DOMAIN
        VITE_FIREBASE_PROJECT_ID=TUO_PROJECT_ID
        VITE_FIREBASE_STORAGE_BUCKET=TUO_STORAGE_BUCKET
        VITE_FIREBASE_MESSAGING_SENDER_ID=TUO_MESSAGING_SENDER_ID
        VITE_FIREBASE_APP_ID=TUO_APP_ID
        VITE_FIREBASE_MEASUREMENT_ID=TUO_MEASUREMENT_ID
        ```
    *   **(Per Firebase Functions/Admin SDK):** Potrebbe essere necessario configurare le credenziali dell'Admin SDK per l'emulazione locale o il deployment. Consulta la documentazione Firebase per `GOOGLE_APPLICATION_CREDENTIALS`.

3.  **Installa le Dipendenze del Frontend:**
    ```bash
    cd client
    npm install
    ```

4.  **Installa le Dipendenze del Backend:**
    ```bash
    cd ../functions
    npm install
    ```

## Esecuzione Locale

1.  **Avvia il Frontend (Client):**
    ```bash
    cd ../client
    npm run dev
    ```
    L'applicazione sarà disponibile su `http://localhost:5173` (o porta simile).

2.  **Avvia l'Emulatore Firebase Functions (Opzionale):**
    *   Assicurati di avere Firebase CLI installato (`npm install -g firebase-tools`).
    *   Esegui il login a Firebase (`firebase login`).
    *   Compila le functions TypeScript:
        ```bash
        cd ../functions
        npm run build
        ```
    *   Avvia l'emulatore dalla directory principale del progetto (`fitness_tracker_new`):
        ```bash
        firebase emulators:start --only functions
        ```
    L'API Express sarà disponibile su un endpoint locale fornito dall'emulatore.

## Build per Produzione

1.  **Build del Frontend:**
    ```bash
    cd client
    npm run build
    ```
    I file ottimizzati verranno generati nella directory `client/dist`.

2.  **Build del Backend (Firebase Functions):**
    ```bash
    cd ../functions
    npm run build
    ```
    Il codice JavaScript compilato verrà generato nella directory `functions/lib`.

## Deployment

*   **Netlify:** Il progetto è configurato per il deployment automatico su Netlify tramite il file `netlify.toml`. Collega il tuo repository GitHub a un sito Netlify. Netlify dovrebbe rilevare la configurazione e buildare/deployare il frontend dalla directory `client/dist`.
*   **Firebase Functions:** Deploya le funzioni separatamente usando Firebase CLI:
    ```bash
    firebase deploy --only functions
    ```

## Note

*   L'autenticazione Apple richiede configurazioni aggiuntive sia nella console Firebase che potenzialmente nell'account Apple Developer.
*   Il backend API in Firebase Functions (`functions/src/index.ts`) è attualmente minimale e contiene solo una rotta di esempio. Dovrà essere espanso in base alle necessità specifiche dell'applicazione.
*   Molti componenti e logiche sono stati copiati dal progetto precedente. Potrebbero richiedere ulteriori adattamenti per funzionare perfettamente con Firebase.

