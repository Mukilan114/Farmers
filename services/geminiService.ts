
import { GoogleGenAI, Type } from "@google/genai";
import { Equipment, Produce } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getCombinedRecommendation(
  query: string,
  equipment: Equipment[],
  produce: Produce[]
): Promise<{ message: string; suggestedIds: string[] }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is a farmer asking: "${query}". 
      Available Equipment: ${JSON.stringify(equipment.map(i => ({id: i.id, name: i.name, category: i.category})))}
      Available Produce/Marketplace: ${JSON.stringify(produce.map(i => ({id: i.id, name: i.name, category: i.category})))}
      
      Recommend 1-4 items from either list that best match the farmer's intent. 
      Respond in JSON with:
      - "message": A concise, helpful recommendation in simple English.
      - "suggestedIds": Array of IDs that match.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            suggestedIds: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["message", "suggestedIds"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      message: result.message || "I found these items for you.",
      suggestedIds: result.suggestedIds || []
    };
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return {
      message: "I can help you find equipment to rent or fresh produce to buy. What are you looking for today?",
      suggestedIds: []
    };
  }
}
