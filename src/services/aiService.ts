import OpenAI from "openai";
import { SafetyCategory } from "../types/chat";

export interface AIResponse {
  message: string;
  safetyCategory: SafetyCategory;
}

const SYSTEM_PROMPT = `You are a compassionate mental health assistant responsible for providing emotional and moral support. Respond with empathy, validate the user's feelings, and offer kind, supportive guidance. You are not a replacement for professional care — remind users of this when appropriate.

You must respond with valid JSON containing exactly two fields:
- "message": Your supportive, empathetic response to the user.
- "safetyCategory": One of "self-harm", "violence", or "none".

Classification rules for safetyCategory:
- "self-harm": The user is expressing thoughts of committing self-harm in any physical shape or form.
- "violence": The user is expressing thoughts of committing violence towards themselves or another person or persons.
- "none": Neither of the above conditions is met.

Always respond in valid JSON. Do not include any text outside the JSON object.`;

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getAIResponse(userMessage: string): Promise<AIResponse> {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(content) as {
    message: string;
    safetyCategory: string;
  };

  const validCategories: string[] = Object.values(SafetyCategory);
  const safetyCategory = validCategories.includes(parsed.safetyCategory)
    ? (parsed.safetyCategory as SafetyCategory)
    : SafetyCategory.None;

  return {
    message: parsed.message,
    safetyCategory,
  };
}
