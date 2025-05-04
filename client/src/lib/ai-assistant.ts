import { apiRequest } from "@/lib/queryClient";

interface AiAssistantResponse {
  response: string;
}

/**
 * Asks the AI Assistant a question and returns the response
 * @param query The question to ask the AI Assistant
 * @returns Promise with the AI response
 */
export async function askAiAssistant(query: string): Promise<AiAssistantResponse> {
  try {
    const res = await apiRequest("POST", "/api/ai/ask", { query });
    return await res.json();
  } catch (error) {
    console.error("Error asking AI Assistant:", error);
    throw new Error("Failed to get response from AI Assistant");
  }
}

/**
 * Refreshes AI suggestions
 * @returns Promise with the new suggestions
 */
export async function refreshAiSuggestions() {
  try {
    const res = await apiRequest("POST", "/api/ai/refresh-suggestions", {});
    return await res.json();
  } catch (error) {
    console.error("Error refreshing AI suggestions:", error);
    throw new Error("Failed to refresh AI suggestions");
  }
}

/**
 * Gets the latest AI suggestions
 * @returns Promise with the latest suggestions
 */
export async function getAiSuggestions() {
  try {
    const res = await fetch("/api/ai/suggestions", {
      credentials: "include",
    });
    
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    throw new Error("Failed to get AI suggestions");
  }
}

/**
 * Generates workout recommendations based on user preferences
 * @param preferences User preferences for workout generation
 * @returns Promise with recommended workout
 */
export async function generateWorkoutRecommendation(preferences: {
  goal: string;
  duration: number;
  equipment: string[];
  level: string;
}) {
  try {
    const res = await apiRequest("POST", "/api/ai/generate-workout", preferences);
    return await res.json();
  } catch (error) {
    console.error("Error generating workout recommendation:", error);
    throw new Error("Failed to generate workout recommendation");
  }
}
