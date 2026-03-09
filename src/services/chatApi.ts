import type { Conversation, Message } from "../types/chat";

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
 * Delete a conversation by id
 */
export const deleteConversation = async (id: string): Promise<void> => {
  const baseUrl = import.meta.env.VITE_BE_BASE_URL;
  const response = await fetch(
    `${baseUrl}/v1/conversations/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    throw new Error(`Failed to delete conversation: ${response.statusText}`);
  }
};

/**
 * Fetch all conversations for the user
 */
export const fetchConversations = async (
  userId: string,
): Promise<Conversation[]> => {
  const baseUrl = import.meta.env.VITE_BE_BASE_URL;
  const response = await fetch(
    `${baseUrl}/v1/conversations?userId=${encodeURIComponent(userId)}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Fetch messages for a specific conversation
 * TODO: Replace with actual API call
 */
export const fetchConversationMessages = async (
  conversationId: string,
): Promise<Message[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // TODO: Make actual API call
  // const response = await fetch(`/api/conversations/${conversationId}/messages`);
  // const data = await response.json();
  // return data;

  // Return mock data for now
  return mockMessages[parseInt(conversationId, 10)] || [];
};

/**
 * Send a message in a conversation
 * TODO: Replace with actual API call
 */
export const sendMessage = async (
  _conversationId: string,
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
 */
export const createConversation = async ({
  userId,
  title,
  status,
}: {
  userId: string;
  title: string | null;
  status: string;
}): Promise<Conversation> => {
  const baseUrl = import.meta.env.VITE_BE_BASE_URL;
  const response = await fetch(`${baseUrl}/v1/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`);
  }
  const data: { id: string } = await response.json();
  const now = new Date().toISOString();
  return { id: data.id, userId, title, status, createdAt: now, updatedAt: now };
};
