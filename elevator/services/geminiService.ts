
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getBuildingAdvice = async (stats: any, period: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the AI Building Manager. Current scenario: ${period}. 
      Stats: ${JSON.stringify(stats)}. 
      Give a very brief, witty, one-sentence advice to the player on how to improve their elevator management.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Keep the floors moving!";
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return "Optimize your routes to minimize wait times!";
  }
};

export const getScenarioAnnouncement = async (period: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Announce the start of ${period} in a corporate, humorous tone. Max 15 words.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || `Alert: ${period} has begun!`;
  } catch (error) {
    return `Warning: ${period} is in effect.`;
  }
};
