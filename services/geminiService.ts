import { GoogleGenAI } from "@google/genai";
import { ExtractedIdentityData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const processDocument = async (file: File): Promise<ExtractedIdentityData> => {
  try {
    const imagePart = await fileToGenerativePart(file);

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: {
        role: 'user',
        parts: [
          imagePart,
          { text: `
            Analyze this document/image and extract ALL visible text and data fields into a raw structured JSON object.

            Instructions:
            1. Extract EVERY field, label, table row, and text block visible. Do not summarize; extract exact values.
            2. Use the visible label text as the JSON key (normalized to camelCase).
            3. If the document contains a table (like grades, items, transactions), extract it as an array of objects.
            4. Infer a "documentType" field (e.g., "Statement of Grades", "Passport", "Invoice", "Blueprint") based on the content.
            5. Include a "confidenceScore" (0.0 to 1.0) for the extraction quality.
            6. STRICTLY return valid JSON. No markdown code blocks.
            ` 
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        // We do NOT provide a strict responseSchema here to allow the model 
        // to dynamically generate keys based on what it sees in the image.
        temperature: 0.1,
      }
    });

    const responseText = result.text;
    if (!responseText) {
      throw new Error("No response from Gemini.");
    }

    // Clean up potential markdown formatting (```json ... ```) just in case
    const cleanedText = responseText.replace(/```json|```/g, '').trim();

    return JSON.parse(cleanedText) as ExtractedIdentityData;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};