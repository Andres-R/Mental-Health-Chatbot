import type { Chat, Message } from "../types/chat";

// Mock data
const mockChats: Chat[] = [
  {
    id: 1,
    name: "Anxiety Support",
    messages: [],
  },
  {
    id: 2,
    name: "Sleep Issues",
    messages: [],
  },
  {
    id: 3,
    name: "Stress Management",
    messages: [],
  },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      text: "Hi, I've been feeling anxious lately.",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "I'm here to help. Can you tell me more about what's been causing your anxiety?",
      sender: "bot",
      timestamp: new Date(),
    },
  ],
  2: [
    {
      id: 1,
      text: "I'm having trouble sleeping at night.",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "Sleep is very important for mental health. Let's explore some strategies that might help you.",
      sender: "bot",
      timestamp: new Date(),
    },
  ],
  3: [],
};

/**
 * Fetch all conversations for the user
 * TODO: Replace with actual API call
 */
export const fetchConversations = async (): Promise<Chat[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // TODO: Make actual API call
  // const response = await fetch('/api/conversations');
  // const data = await response.json();
  // return data;

  // Return mock data for now
  return mockChats;
};

/**
 * Fetch messages for a specific conversation
 * TODO: Replace with actual API call
 */
export const fetchConversationMessages = async (
  conversationId: number,
): Promise<Message[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // TODO: Make actual API call
  // const response = await fetch(`/api/conversations/${conversationId}/messages`);
  // const data = await response.json();
  // return data;

  // Return mock data for now
  return mockMessages[conversationId] || [];
};

/**
 * Send a message in a conversation
 * TODO: Replace with actual API call
 */
export const sendMessage = async (
  _conversationId: number,
  message: string,
): Promise<{ userMessage: Message; botMessage: Message }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const userMessage: Message = {
    id: Date.now(),
    text: message,
    sender: "user",
    timestamp: new Date(),
  };

  // Mock bot responses
  const botResponses = [
    "Thank you for sharing that with me. How does that make you feel?",
    "I understand. That sounds challenging. Can you tell me more?",
    "It's completely normal to feel this way. What helps you cope?",
    "I'm here to listen. Would you like to explore this further?",
    "That's a great insight. How long have you been experiencing this?",
    "Remember, it's okay to take things one step at a time.",
  ];

  const botMessage: Message = {
    id: Date.now() + 1,
    text: botResponses[Math.floor(Math.random() * botResponses.length)],
    sender: "bot",
    timestamp: new Date(),
  };

  // TODO: Make actual API call
  // const response = await fetch(`/api/conversations/${conversationId}/messages`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message })
  // });
  // return await response.json();

  return { userMessage, botMessage };
};

/**
 * Create a new conversation
 * TODO: Replace with actual API call
 */
export const createConversation = async (name: string): Promise<Chat> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newChat: Chat = {
    id: Date.now(),
    name,
    messages: [],
  };

  // TODO: Make actual API call
  // const response = await fetch('/api/conversations', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name })
  // });
  // return await response.json();

  return newChat;
};
