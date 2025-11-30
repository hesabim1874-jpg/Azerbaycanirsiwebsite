import { GoogleGenAI, Type } from '@google/genai';
import { ARTIST_CONTEXT_DATA } from '../constants';
import { RegionData, Language } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchRegionData = async (regionName: string, lang: Language, apiKey: string): Promise<RegionData> => {
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  const systemInstructionAZ = `
    Sən Azərbaycan mədəniyyəti, tarixi, incəsənəti və etnoqrafiyası üzrə ekspertsən.
    İstifadəçi bir region seçəcək. Sən həmin region haqqında aşağıdakı struktura uyğun JSON formatında məlumat verməlisən:
    
    1. Tarixi icmal (history)
    2. Dialekt və ağız xüsusiyyətləri (dialectFeatures)
    3. Musiqi və ifaçılıq sənəti (music - muğam, aşıq və s.)
    4. Sənətkarlıq (crafts - xalçaçılıq, misgərlik və s.)
    5. Rəssamlar və Məşhur Simalar (artists).
    
    ÇOX VACİB: "Artists" bölməsi üçün aşağıdakı verilənlər bazasından istifadə et. Əgər region bazada varsa, ORADAKI məlumatları dəqiq istifadə et. Əgər yoxdursa, öz biliyinə əsaslan.
    
    VERİLƏNLƏR BAZASI:
    ${ARTIST_CONTEXT_DATA}
    
    Cavab yalnız Azərbaycan dilində olmalıdır.
  `;

  const systemInstructionEN = `
    You are an expert on Azerbaijani culture, history, art, and ethnography.
    The user will select a region. You must provide information about that region in JSON format with the following structure:
    
    1. Historical Overview (history)
    2. Dialect and language features (dialectFeatures)
    3. Music and Performance Art (music - mugham, ashug, etc.)
    4. Folk Crafts (crafts - carpet weaving, coppersmithing, etc.)
    5. Artists and Famous Figures (artists).
    
    VERY IMPORTANT: For the 'Artists' section, use the following database. If the region exists in the database, use that information accurately (translate where appropriate to English, but keep names original). If not, use your own knowledge.
    
    DATABASE:
    ${ARTIST_CONTEXT_DATA}
    
    Response must be in English.
  `;

  const systemInstruction = lang === 'az' ? systemInstructionAZ : systemInstructionEN;
  const prompt = lang === 'az' 
    ? `${regionName} regionu haqqında mədəni məlumatları və rəssamları ver.` 
    : `Provide cultural information and artists for the ${regionName} region.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          history: { type: Type.STRING },
          dialectFeatures: { type: Type.STRING },
          music: { type: Type.STRING },
          crafts: { type: Type.STRING },
          artists: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                period: { type: Type.STRING },
                famousWorks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }
          }
        },
        required: ['history', 'dialectFeatures', 'music', 'crafts', 'artists']
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as RegionData;
  }
  throw new Error("No data returned from API");
};

// Global Queue for Image Generation to prevent 429 errors across components
interface QueueItem {
  prompt: string;
  apiKey: string;
  resolve: (url: string) => void;
  reject: (error: any) => void;
  retryCount: number;
}

const imageQueue: QueueItem[] = [];
let isProcessingQueue = false;

// Helper to check for various forms of Rate Limit / Quota errors
const isRateLimitError = (error: any): boolean => {
  if (!error) return false;
  
  const status = error.status || error.code;
  const message = (error.message || '').toLowerCase();
  
  // Check nested error object
  const nestedCode = error.error?.code;
  const nestedStatus = error.error?.status;

  return (
    status === 429 || 
    status === 'RESOURCE_EXHAUSTED' || 
    nestedCode === 429 ||
    nestedStatus === 'RESOURCE_EXHAUSTED' ||
    message.includes('429') || 
    message.includes('quota') || 
    message.includes('exhausted') ||
    message.includes('too many requests')
  );
};

const processQueue = async () => {
  if (isProcessingQueue || imageQueue.length === 0) return;
  isProcessingQueue = true;

  while (imageQueue.length > 0) {
    const item = imageQueue[0]; // Peek
    try {
      const url = await performGenerateImage(item.prompt, item.apiKey, item.retryCount);
      item.resolve(url);
      imageQueue.shift(); // Remove on success
    } catch (error: any) {
       if (isRateLimitError(error) && item.retryCount < 5) {
        console.warn(`Rate limit hit in queue. Retrying... (${item.retryCount + 1}/5)`);
        item.retryCount += 1;
        // Exponential backoff: 4s, 8s, 16s, 32s, 64s
        const delay = Math.pow(2, item.retryCount + 2) * 1000; 
        await sleep(delay); 
        continue; // Retry the same item
      } else {
        console.error("Fatal error in queue item:", error);
        item.reject(error);
        imageQueue.shift(); // Remove failed item
      }
    }
    
    // Mandatory cooldown between ANY requests to be safe with Free Tier limits
    await sleep(10000);
  }

  isProcessingQueue = false;
};

const performGenerateImage = async (prompt: string, apiKey: string, retryCount: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio: '4:3' }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image generated');
};

export const generateImage = (prompt: string, apiKey: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
        reject(new Error("API Key missing"));
        return;
    }
    imageQueue.push({ prompt, apiKey, resolve, reject, retryCount: 0 });
    processQueue();
  });
};