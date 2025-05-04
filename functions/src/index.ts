import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

// Initialize Firebase Admin SDK (requires service account key in environment or default credentials)
// You might need to set GOOGLE_APPLICATION_CREDENTIALS environment variable
// or initialize with a service account key file for local emulation/deployment.
try {
  admin.initializeApp();
} catch (e) {
  console.error("Firebase Admin SDK initialization failed:", e);
  // Initialization might happen automatically in deployed Functions environment
}

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// --- API Routes ---

// Example Route
app.get("/hello", (req, res) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase Express backend!");
});

// Add more routes here later based on application needs
// e.g., routes for handling specific backend logic not suitable for client-side Firestore access
// app.post("/process-payment", (req, res) => { ... });
// app.get("/admin/users", (req, res) => { ... });

// --- Export Express app as an HTTP Function ---

// Expose Express API as a single Cloud Function named 'api'
export const api = functions.region("europe-west1") // Choose appropriate region
  .https.onRequest(app);

// You can add other types of functions here as well (e.g., Firestore triggers)
/*
export const onUserCreate = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    const userData = snap.data();
    functions.logger.info(`New user created: ${userData.email}`, { userId: context.params.userId });
    // Perform actions on user creation, e.g., send welcome email
    return null;
  });
*/

