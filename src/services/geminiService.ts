import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const searchProducts = async (query: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search for chemical products related to: ${query}. Return a list of products with their CAS numbers and primary industrial applications.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text;
};

export const analyzeChemicalImage = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        { text: "Analyze this chemical product image. Identify the product, check for compliance labels (GMP, REACH, ISO), and describe its physical properties if visible." },
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
      ]
    }
  });
  return response.text;
};

export const getChatResponse = async (message: string, history: any[] = []) => {
  const chat = ai.chats.create({
    model: "gemini-3.1-flash-lite-preview",
    config: {
      systemInstruction: "You are a technical specialist for SoleChem Europe, a B2B chemical supplier. You are an expert in chemical distribution, custom formulation, and compliance (REACH, GMP, ISO). Be professional, technical, and helpful. Always emphasize B2B terms like RFQ, MOQ, and Incoterms.",
    },
  });

  // Note: sendMessage only accepts message parameter
  const response = await chat.sendMessage({ message });
  return response.text;
};
