import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateDictionary() {
  console.log("Generating dictionary data...");
  const prompt = `Generate a comprehensive list of 1000+ "Kamus Gaul" phrases for Indonesian expats in Taiwan. 
  The list should include phrases in Indonesian, their Mandarin equivalent (Traditional Chinese), Hokkien equivalent (if applicable, otherwise Mandarin), and the pronunciation (Pinyin for Mandarin, Pe̍h-ōe-jī or simplified pronunciation for Hokkien).
  
  Categories:
  1. Greeting & Daily Life
  2. Working with Elderly (Caregiver)
  3. Factory & Construction
  4. Food & Shopping
  5. Emergency & Health
  6. Slang & Emotions
  
  Format the output as a JSON array of objects:
  {
    "category": "string",
    "indo": "string",
    "mandarin": "string",
    "hokkien": "string",
    "pronunciation": "string"
  }
  
  Please provide as many as possible in one go. If you can't do 1000, do at least 200 high-quality ones.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              indo: { type: Type.STRING },
              mandarin: { type: Type.STRING },
              hokkien: { type: Type.STRING },
              pronunciation: { type: Type.STRING }
            },
            required: ["category", "indo", "mandarin", "pronunciation"]
          }
        }
      }
    });

    const data = response.text;
    fs.writeFileSync("./src/dictionaryData.json", data);
    console.log("Dictionary data generated successfully!");
  } catch (error) {
    console.error("Error generating dictionary:", error);
  }
}

generateDictionary();
