import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY environment variable is not set. AI features will not work until this is configured.');
}

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const TONE_MAP = {
  Warm: 'warm, friendly, and emotionally supportive',
  Funny: 'humorous, lighthearted, and playful without being inappropriate',
  Formal: 'professional, respectful, and courteous',
};

const LENGTH_MAP = {
  Short: { tokens: 150, description: '1-2 sentences' },
  Medium: { tokens: 300, description: '3-4 sentences' },
  Long: { tokens: 500, description: '5-6 sentences' },
};

export async function generateMessage({
  contactName,
  tone = 'Warm',
  length = 'Medium',
  relationshipType = null,
  importanceLevel = null,
  lastContacted = null,
  healthScore = null,
  recentNotes = null,
  context = null,
}) {
  if (!ai) throw new Error('GEMINI_API_KEY not configured.');
  
  if (!contactName) {
    throw new Error('contactName is required');
  }

  if (!TONE_MAP[tone]) {
    throw new Error(`Invalid tone: ${tone}. Must be one of: ${Object.keys(TONE_MAP).join(', ')}`);
  }

  if (!LENGTH_MAP[length]) {
    throw new Error(`Invalid length: ${length}. Must be one of: ${Object.keys(LENGTH_MAP).join(', ')}`);
  }

  const toneDescription = TONE_MAP[tone];
  const lengthConfig = LENGTH_MAP[length];

  let contextInfo = '';
  if (relationshipType) contextInfo += `\n- Relationship: ${relationshipType}`;
  if (importanceLevel) contextInfo += `\n- Importance to you: ${importanceLevel}/5`;
  if (lastContacted) contextInfo += `\n- Last contacted: ${lastContacted}`;
  if (healthScore !== null) contextInfo += `\n- Relationship health: ${healthScore}/100`;
  if (recentNotes) contextInfo += `\n- Notes: ${recentNotes}`;
  if (context) contextInfo += `\n- Additional context: ${context}`;

  const systemPrompt = `You are an emotionally intelligent relationship coach helping someone stay connected with their relationships.

Your task is to write a check-in message that feels:
- Natural and conversational (not robotic or template-like)
- Genuine and heartfelt (avoiding clichés and generic phrases)
- Personalized to the relationship context provided
- Appropriate for texting or messaging (casual, not formal letters)

CRITICAL RULES:
1. Never use phrases like "I hope this message finds you well" or "I wanted to reach out"
2. Don't start with time references unless necessary ("It's been a while...")
3. Avoid corporate/formal language - this is a personal relationship
4. Make it sound like something a real person would text their friend
5. Keep it ${lengthConfig.description}
6. Use the ${toneDescription} tone
7. Don't include greetings like "Dear" or sign-offs like "Best regards"
8. Write just the message body, ready to send

Think of how you would genuinely text someone you care about - be specific, warm, and real.`;

  const userPrompt = `Write a ${tone.toLowerCase()}, ${length.toLowerCase()} check-in message to ${contactName}.
${contextInfo ? `\nContext about this relationship:${contextInfo}` : ''}

Remember: This should sound like something you'd actually text, not a formal email or template. Be real, be warm, and be specific to this person.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    const message = response.text?.trim();

    if (!message) {
      throw new Error('Gemini returned an empty message');
    }

    return message;
  } catch (error) {
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.');
    }
    throw error;
  }
}

export async function generateInsights(contacts) {
  if (!ai) throw new Error('GEMINI_API_KEY not configured.');
  
  if (!Array.isArray(contacts)) {
    throw new Error('contacts must be an array');
  }

  if (contacts.length === 0) {
    return {
      wins: ["You're ready to start building relationships! Add your first contact to begin."],
      attention_needed: ["Add some contacts to your network so we can help you nurture them."],
      growth_opportunities: ["Think about friends, family, or colleagues you'd like to stay closer with."]
    };
  }

  const contactsList = contacts
    .slice(0, 10)
    .map(c => {
      const details = [];
      if (c.relationship_type) details.push(c.relationship_type);
      if (c.last_contacted) details.push(`Last: ${c.last_contacted}`);
      if (c.health_score !== null) details.push(`Health: ${c.health_score}/100`);
      return `- ${c.name}${details.length > 0 ? ` (${details.join(', ')})` : ''}`;
    })
    .join('\n');

  const systemPrompt = `You are an empathetic relationship coach providing actionable insights.
Output strictly as JSON in the following format:
{
  "wins": ["One actionable insight about a strong or improving relationship"],
  "attention_needed": ["One actionable insight about a relationship that needs contact"],
  "growth_opportunities": ["One actionable insight about a relationship that could be deepened"]
}
Keep each insight to 1-2 sentences. Be specific, empathetic, and encouraging.`;

  const userPrompt = `Analyze these relationships and provide categorized insights in JSON format:

${contactsList}

Focus on who needs attention, who you have strong bonds with, and specific actions they can take today.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    });

    let insightsRaw = response.text?.trim();
    if (!insightsRaw) {
      throw new Error('Gemini returned empty insights');
    }

    try {
      const parsed = JSON.parse(insightsRaw);
      return parsed;
    } catch (e) {
      // Fallback if AI somehow messes up the JSON
      return {
        wins: [],
        attention_needed: [insightsRaw],
        growth_opportunities: []
      };
    }
  } catch (error) {
    throw error;
  }
}
