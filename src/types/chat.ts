export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface Chat {
  id: number;
  name: string;
  messages: Message[];
}

export interface Conversation {
  id: string;
  userId: string;
  title: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const MessageRole = {
  User: "user",
  Assistant: "assistant",
  System: "system",
} as const;
export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];

export const SafetyCategory = {
  SelfHarm: "self-harm",
  Violence: "violence",
  None: "none",
} as const;
export type SafetyCategory =
  (typeof SafetyCategory)[keyof typeof SafetyCategory];

export interface ApiMessage {
  id: string;
  conversation_id: string;
  user_id: string | null;
  role: MessageRole;
  message: string;
  created_at: string;
  safety_flag: boolean;
  safety_category: SafetyCategory;
}
