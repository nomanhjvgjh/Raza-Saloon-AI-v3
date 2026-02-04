
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFace = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze the person's face shape (e.g., oval, round, square, heart, diamond), forehead size, and jawline. Specifically for men's grooming, suggest 3 hairstyle styles that would suit them. Return as JSON." }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          faceShape: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          features: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['faceShape', 'recommendations', 'features']
      }
    }
  });

  return JSON.parse(response.text || '{}') as AnalysisResult;
};

export const applyHairstyle = async (base64Image: string, stylePrompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: `Modify the image to give the man this specific hairstyle: ${stylePrompt}. 

CRITICAL INSTRUCTIONS:
1. ONLY change the hair on the head. 
2. KEEP the facial features (eyes, nose, mouth, skin texture) 100% identical to the original.
3. MATCH the lighting, shadow, and environment of the original image exactly.
4. BLEND the new hairline naturally with the forehead and temples.
5. If the original image has a beard, KEEP the beard unchanged.
6. The result must look like a real photograph taken in a professional barbershop.` }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error('Failed to generate hairstyle image');
};
