
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to check if an error is transient and worth retrying
const isRetryableError = (error: unknown): boolean => {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        // Rate limiting and generic server/network errors are good candidates for retries.
        return message.includes('resource has been exhausted') || message.includes('429') || message.includes('503') || message.includes('server error') || message.includes('network error');
    }
    return false;
};

// Helper to map raw errors to more user-friendly messages
const mapToUserFriendlyError = (error: unknown): Error => {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('api key not valid')) {
            return new Error('The configured API key is invalid. Please check your environment setup.');
        }
        if (message.includes('resource has been exhausted') || message.includes('429')) {
            return new Error('The service is temporarily busy due to high demand. Please try again in a few moments.');
        }
        if (message.includes('image') && (message.includes('invalid') || message.includes('unsupported'))) {
            return new Error('The uploaded image is invalid or in an unsupported format. Please try a different one.');
        }
        if (message.includes('did not return a text description')) {
            return new Error('The AI could not describe the image. It might be unclear or unsupported.');
        }
    }
    // Generic fallback for errors that are not specifically handled
    return new Error("Could not get a description from the AI service due to an unexpected error.");
};

export async function describeImage(imageBase64: string, mimeType: string): Promise<string> {
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF_MS = 1000;
  let attempt = 0;
  let delay = INITIAL_BACKOFF_MS;

  while (attempt < MAX_RETRIES) {
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
      console.error(`Error calling Gemini API on attempt ${attempt + 1}:`, error);

      if (isRetryableError(error) && attempt < MAX_RETRIES - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        attempt++;
      } else {
        // Non-retryable error or max retries reached, throw a user-friendly error
        throw mapToUserFriendlyError(error);
      }
    }
  }

  // This should theoretically not be reached due to the loop structure,
  // but it's here for type safety and as a fallback.
  throw new Error("Failed to generate description after multiple retries.");
}
