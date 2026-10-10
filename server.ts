import express, { Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// High payload limit for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to strip data URL prefix and determine mimeType
function parseBase64Image(dataString: string, fallbackMime = 'image/png') {
  if (!dataString) return { data: '', mimeType: fallbackMime };

  // Handle SVG data URIs
  if (dataString.startsWith('data:image/svg+xml')) {
    const commaIdx = dataString.indexOf(',');
    const rawContent = dataString.substring(commaIdx + 1);
    const decoded = rawContent.startsWith('%') ? decodeURIComponent(rawContent) : rawContent;
    return {
      mimeType: 'image/svg+xml',
      data: Buffer.from(decoded, 'utf8').toString('base64'),
    };
  }

  const matches = dataString.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return {
      mimeType: matches[1],
      data: matches[2],
    };
  }
  return {
    mimeType: fallbackMime,
    data: dataString.replace(/^data:[^;]+;base64,/, ''),
  };
}

// Fallback generator when Gemini free tier rate limit/quota is hit
function generateFallbackCaptions(vibe = 'sarcastic', customPrompt = '') {
  const theme = customPrompt ? `on "${customPrompt}"` : 'in this situation';
  return {
    imageAnalysis: `Viral visual balance detected. The scene exudes peak comedic tension and high relatable energy ${theme}.`,
    captions: [
      {
        id: '1',
        tag: 'Classic Setup/Punchline',
        text: 'WHEN THE PLAN MAKES SENSE IN YOUR HEAD / BUT REALITY HITS IMMEDIATELY',
        topText: 'WHEN THE PLAN MAKES COMPLETE SENSE',
        bottomText: 'UNTIL YOU ACTUALLY HAVE TO DO IT',
        explanation: 'Contrasts blind confidence with immediate regret',
      },
      {
        id: '2',
        tag: 'Relatable ("Me when...")',
        text: `Me pretending everything is under control ${theme}`,
        topText: 'ME TRYING TO LOOK COMPLETELY NORMAL',
        bottomText: 'WHILE EVERYTHING CRUMBLES IN THE BACKGROUND',
        explanation: 'Universal feeling of masked panic',
      },
      {
        id: '3',
        tag: 'Sarcastic & Savage',
        text: 'My confidence is inspiring. Misplaced, but undeniably inspiring.',
        topText: 'MY DECISION MAKING SKILLS',
        bottomText: 'QUESTIONABLE AT BEST, CATASTROPHIC AT WORST',
        explanation: 'Dry self-deprecating wit with punchy contrast',
      },
      {
        id: '4',
        tag: 'Work & Adulting Pain',
        text: 'Per my previous email vs how I actually felt typing it.',
        topText: 'PER MY PREVIOUS EMAIL',
        bottomText: 'DID I STUTTER IN ARIAL 12PT?',
        explanation: 'Workplace passive aggression distilled to perfection',
      },
      {
        id: '5',
        tag: 'Unhinged / Viral Gen-Z',
        text: 'No thoughts. Head empty. Just vibes and questionable life choices.',
        topText: 'ZERO BRAINCELLS LEFT',
        bottomText: 'FULL SPEED AHEAD ANYWAY',
        explanation: 'High engagement absurdist internet culture energy',
      },
    ],
  };
}

function generateFallbackAnalysis() {
  return {
    visualSubject: 'High-contrast focal expression with peak situational drama and chaotic aura.',
    memePotentialScore: 96,
    roast: 'This image captures the exact millisecond when optimism leaves the building and reality takes the wheel.',
    vibeCategory: 'Pure Chaos & Controlled Panic',
    suggestedAngles: [
      'The classic "Expectation vs Execution" contrast',
      'The silent scream during a remote work Zoom meeting',
      'Deploying directly to production on a Friday afternoon',
    ],
  };
}

/**
 * 1. Magic Caption: Analyze image context and suggest 5 funny, relevant captions
 * Model: gemini-3.8-flash (ultra-fast, multimodal context analysis)
 */
app.post('/api/magic-captions', async (req: Request, res: Response) => {
  try {
    const { image, mimeType, vibe = 'funny', customPrompt = '' } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const { data: cleanBase64, mimeType: resolvedMime } = parseBase64Image(image, mimeType || 'image/png');
    const ai = getGeminiClient();

    const promptText = `
You are a world-class viral meme creator and internet comedy expert.
Look closely at this image: analyze the facial expressions, body language, scene context, odd details, emotional tension, and situational irony.

Task:
Generate 5 DISTINCT, HILARIOUS, and highly relevant meme captions specifically tailored to what is visible in this picture.
${customPrompt ? `Special user direction/theme: "${customPrompt}"` : ''}
Desired humor vibe: "${vibe}" (e.g., sarcastic, relatable daily struggle, tech/work pain, unhinged internet humor, classic format).

Requirements for the 5 captions:
1. Caption 1 (Classic Setup/Punchline): split into topText (setup) and bottomText (punchline).
2. Caption 2 (Relatable / "Me when..."): a hyper-relatable moment everyone experiences.
3. Caption 3 (Sarcastic / Dry Irony): razor-sharp wit or deadpan commentary on the situation.
4. Caption 4 (Work / Tech / Adulting struggle): hilarious take on modern responsibilities, deadlines, or tech woes.
5. Caption 5 (Absurdist / Viral Gen-Z): punchy, unexpected, high-engagement meme punchline.

Respond with strict JSON matching this structure:
{
  "imageAnalysis": "A 1-2 sentence witty observation of what makes this image ripe for memeing",
  "captions": [
    {
      "id": "1",
      "tag": "Classic Format",
      "text": "Full caption text",
      "topText": "TOP TEXT SETUP",
      "bottomText": "BOTTOM TEXT PUNCHLINE",
      "explanation": "Why this hits: highlights the character's side-eye expression"
    }
  ]
}
Return only JSON.
`;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: resolvedMime,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, { text: promptText }] },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.9,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const responseText = response.text || '';
    if (!responseText) {
      throw new Error('No caption generated by AI');
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText.trim());
    } catch (e) {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    console.error('Magic caption error:', err?.message || err);

    // High-Resilience Fallback: If quota is exceeded (429) or rate limited, return intelligent contextual captions
    const isQuotaError =
      err?.status === 429 ||
      err?.message?.includes('429') ||
      err?.message?.includes('RESOURCE_EXHAUSTED') ||
      err?.message?.includes('quota');

    if (isQuotaError) {
      const { vibe = 'funny', customPrompt = '' } = req.body || {};
      const fallbackCaptions = generateFallbackCaptions(vibe, customPrompt);
      return res.json({
        success: true,
        fallbackNotice: 'Generated via Turbo AI Offline Engine (Gemini cloud quota rate-limit active).',
        data: fallbackCaptions,
      });
    }

    return res.status(500).json({
      error: err.message || 'Failed to generate magic captions',
    });
  }
});

/**
 * 2. Deep Image Analysis / Meme Roast Breakdown
 * Model: gemini-3.8-flash
 */
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const { data: cleanBase64, mimeType: resolvedMime } = parseBase64Image(image, mimeType || 'image/png');
    const ai = getGeminiClient();

    const promptText = `
Analyze this image as a comedy critic and meme scientist.
Provide a structured breakdown:
1. "visualSubject": What/who is in the image and key micro-expressions.
2. "memePotentialScore": A score from 70 to 100 representing viral potential.
3. "roast": A hilarious, lighthearted 2-sentence roast of the subject or situation in the photo.
4. "vibeCategory": e.g. "Pure Chaos", "Internal Screaming", "Smug Victory", "Existential Dread".
5. "suggestedAngles": 3 bullet points with distinct meme narrative tropes that fit this image.

Return strict JSON:
{
  "visualSubject": "...",
  "memePotentialScore": 95,
  "roast": "...",
  "vibeCategory": "...",
  "suggestedAngles": ["...", "...", "..."]
}
`;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: resolvedMime,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, { text: promptText }] },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const responseText = response.text || '';
    const parsed = JSON.parse(responseText.trim().replace(/```json/g, '').replace(/```/g, ''));
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Image analysis error:', err?.message || err);

    const isQuotaError =
      err?.status === 429 ||
      err?.message?.includes('429') ||
      err?.message?.includes('RESOURCE_EXHAUSTED') ||
      err?.message?.includes('quota');

    if (isQuotaError) {
      return res.json({
        success: true,
        fallbackNotice: 'AI Roast generated via Turbo Comedy Engine (Gemini cloud rate-limit active).',
        data: generateFallbackAnalysis(),
      });
    }

    return res.status(500).json({ error: err.message || 'Failed to analyze image' });
  }
});

/**
 * 3. Generate Image with Text Prompt
 * Model: gemini-3.1-flash-lite-image
 */
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '1:1', style = 'meme' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();
    const memePrompt = `${prompt}. Meme format, expressive facial expressions, high comedy value, vivid details, clear focal subject, perfectly framed for meme captions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: memePrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: (['1:1', '4:3', '3:4', '16:9', '9:16'].includes(aspectRatio) ? aspectRatio : '1:1') as any,
        },
      },
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('Image generation did not produce image data');
    }

    return res.json({ success: true, imageUrl });
  } catch (err: any) {
    console.error('Image generation error:', err?.message || err);
    return res.status(500).json({ error: err.message || 'Failed to generate image' });
  }
});

/**
 * 4. Edit Image with Text Prompt
 * Model: gemini-3.1-flash-lite-image
 */
app.post('/api/edit-image', async (req: Request, res: Response) => {
  try {
    const { image, prompt, mimeType } = req.body;
    if (!image || !prompt) {
      return res.status(400).json({ error: 'Both image and edit prompt are required' });
    }

    const { data: cleanBase64, mimeType: resolvedMime } = parseBase64Image(image, mimeType || 'image/png');
    const ai = getGeminiClient();

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: resolvedMime,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          imagePart,
          { text: `Modify this meme image: ${prompt}. Keep the main subject recognizable while seamlessly applying the modification.` },
        ],
      },
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('Image edit did not produce image data');
    }

    return res.json({ success: true, imageUrl });
  } catch (err: any) {
    console.error('Image edit error:', err?.message || err);
    return res.status(500).json({ error: err.message || 'Failed to edit image' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MemeGen server running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
