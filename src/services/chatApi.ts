import type { Conversation, ApiMessage } from "../types/chat";
import { MessageRole, SafetyCategory } from "../types/chat";

const baseUrl = import.meta.env.VITE_BE_BASE_URL;

/**
 * Delete a conversation by id
 */
export const deleteConversation = async (id: string): Promise<void> => {
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
  const response = await fetch(
    `${baseUrl}/v1/conversations?userId=${encodeURIComponent(userId)}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Fetch messages for a conversation by conversation id (path param)
 */
export const fetchMessages = async (
  conversationId: string,
): Promise<ApiMessage[]> => {
  const response = await fetch(
    `${baseUrl}/v1/messages/${encodeURIComponent(conversationId)}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Post a message to a conversation
 */
export const postMessage = async (payload: {
  conversation_id: string;
  user_id: string | null;
  role: MessageRole;
  message: string;
  safety_flag: boolean;
  safety_category: SafetyCategory;
}): Promise<ApiMessage> => {
  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to post message: ${response.statusText}`);
  }
  return response.json();
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

export { MessageRole, SafetyCategory };
