
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function describeImage(imageBase64: string, mimeType: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: 'You are an expert image analyst. Describe every single detail of this image with precision and clarity. Be thorough and comprehensive in your description.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let textDescription = "";
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          textDescription += part.text;
        }
      }
    }

    if (!textDescription.trim()) {
        throw new Error("The AI did not return a text description. The image might be unclear or unsupported.");
    }
    
    return textDescription;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The configured API key is invalid. Please check your configuration.');
        }
    }
    throw new Error("Could not get a description from the AI service.");
  }
}
