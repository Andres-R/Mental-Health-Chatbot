import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Conversation, Message } from "../types/chat";
import { MessageRole, SafetyCategory } from "../types/chat";
import {
  fetchConversations,
  fetchMessages,
  postMessage,
  createConversation,
  deleteConversation,
  patchConversation,
} from "../services/chatApi";

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  /** Cached messages keyed by conversationId */
  messagesByConversation: Record<string, Message[]>;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  error: string | null;
  userId: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  messagesByConversation: {},
  loadingConversations: false,
  loadingMessages: false,
  sendingMessage: false,
  error: null,
  userId: null,
};

// Guest mode localStorage helpers
function isGuestMode(): boolean {
  return localStorage.getItem("mh_guest_mode") === "true";
}

function getGuestConversations(): Conversation[] {
  const data = localStorage.getItem("mh_conversations");
  return data ? JSON.parse(data) : [];
}

function saveGuestConversations(conversations: Conversation[]): void {
  localStorage.setItem("mh_conversations", JSON.stringify(conversations));
}

function getGuestMessages(): Record<string, Message[]> {
  const data = localStorage.getItem("mh_messages");
  return data ? JSON.parse(data) : {};
}

function saveGuestMessages(messages: Record<string, Message[]>): void {
  localStorage.setItem("mh_messages", JSON.stringify(messages));
}

// Async thunks
export const loadConversations = createAsyncThunk(
  "chat/loadConversations",
  async (userId: string) => {
    if (isGuestMode()) {
      return getGuestConversations();
    }
    return await fetchConversations(userId);
  },
);

export const loadMessages = createAsyncThunk(
  "chat/loadMessages",
  async (conversationId: string, { getState }) => {
    const state = getState() as { chat: ChatState };
    // Return cached messages if they exist
    if (state.chat.messagesByConversation[conversationId]) {
      return {
        conversationId,
        messages: state.chat.messagesByConversation[conversationId],
        cached: true,
      };
    }
    if (isGuestMode()) {
      const allMessages = getGuestMessages();
      return {
        conversationId,
        messages: allMessages[conversationId] ?? [],
        cached: false,
      };
    }
    const messages = await fetchMessages(conversationId);
    return { conversationId, messages, cached: false };
  },
);

export const sendMessageAsync = createAsyncThunk(
  "chat/sendMessage",
  async ({
    conversationId,
    userId,
    message,
  }: {
    conversationId: string;
    userId: string;
    message: string;
  }) => {
    if (isGuestMode()) {
      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: conversationId,
        user_id: userId,
        role: MessageRole.User,
        message,
        created_at: new Date().toISOString(),
        safety_flag: true,
        safety_category: SafetyCategory.None,
      };
      const allMessages = getGuestMessages();
      if (!allMessages[conversationId]) allMessages[conversationId] = [];
      allMessages[conversationId].push(userMsg);
      saveGuestMessages(allMessages);
      return { conversationId, userMessage: userMsg };
    }
    const userMsg = await postMessage({
      conversation_id: conversationId,
      user_id: userId,
      role: MessageRole.User,
      message,
      safety_flag: true,
      safety_category: SafetyCategory.None,
    });
    return { conversationId, userMessage: userMsg };
  },
);

export const sendBotMessageAsync = createAsyncThunk(
  "chat/sendBotMessage",
  async ({
    conversationId,
    message,
  }: {
    conversationId: string;
    message: string;
  }) => {
    if (isGuestMode()) {
      const botMsg: Message = {
        id: `msg-${Date.now()}-bot`,
        conversation_id: conversationId,
        user_id: null,
        role: MessageRole.System,
        message,
        created_at: new Date().toISOString(),
        safety_flag: true,
        safety_category: SafetyCategory.None,
      };
      const allMessages = getGuestMessages();
      if (!allMessages[conversationId]) allMessages[conversationId] = [];
      allMessages[conversationId].push(botMsg);
      saveGuestMessages(allMessages);
      return { conversationId, botMessage: botMsg };
    }
    const botMsg = await postMessage({
      conversation_id: conversationId,
      user_id: null,
      role: MessageRole.System,
      message,
      safety_flag: true,
      safety_category: SafetyCategory.None,
    });
    return { conversationId, botMessage: botMsg };
  },
);

export const createNewConversation = createAsyncThunk(
  "chat/createConversation",
  async ({ userId, title }: { userId: string; title: string | null }) => {
    if (isGuestMode()) {
      const now = new Date().toISOString();
      const conversation: Conversation = {
        id: `conv-${Date.now()}`,
        userId,
        title,
        status: "active",
        createdAt: now,
        updatedAt: now,
      };
      const conversations = getGuestConversations();
      conversations.push(conversation);
      saveGuestConversations(conversations);
      return conversation;
    }
    return await createConversation({ userId, title, status: "active" });
  },
);

export const deleteConversationAsync = createAsyncThunk(
  "chat/deleteConversation",
  async (id: string) => {
    if (isGuestMode()) {
      const conversations = getGuestConversations();
      saveGuestConversations(conversations.filter((c) => c.id !== id));
      const allMessages = getGuestMessages();
      delete allMessages[id];
      saveGuestMessages(allMessages);
      return id;
    }
    await deleteConversation(id);
    return id;
  },
);

export const archiveConversationAsync = createAsyncThunk(
  "chat/archiveConversation",
  async ({ id, status }: { id: string; status: string }) => {
    if (isGuestMode()) {
      const conversations = getGuestConversations();
      const idx = conversations.findIndex((c) => c.id === id);
      if (idx !== -1) {
        conversations[idx] = {
          ...conversations[idx],
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      saveGuestConversations(conversations);
      return conversations[idx];
    }
    return await patchConversation(id, status);
  },
);

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    clearUserId: (state) => {
      state.userId = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetChatState: () => initialState,
  },
  extraReducers: (builder) => {
    // Load conversations
    builder.addCase(loadConversations.pending, (state) => {
      state.loadingConversations = true;
      state.error = null;
    });
    builder.addCase(loadConversations.fulfilled, (state, action) => {
      state.loadingConversations = false;
      state.conversations = action.payload;
      if (!state.currentConversationId && action.payload.length > 0) {
        state.currentConversationId = action.payload[0].id;
      }
    });
    builder.addCase(loadConversations.rejected, (state, action) => {
      state.loadingConversations = false;
      state.error = action.error.message || "Failed to load conversations";
    });

    // Load messages
    builder.addCase(loadMessages.pending, (state) => {
      state.loadingMessages = true;
      state.error = null;
    });
    builder.addCase(loadMessages.fulfilled, (state, action) => {
      state.loadingMessages = false;
      const { conversationId, messages, cached } = action.payload;
      if (!cached) {
        state.messagesByConversation[conversationId] = messages;
      }
    });
    builder.addCase(loadMessages.rejected, (state, action) => {
      state.loadingMessages = false;
      state.error = action.error.message || "Failed to load messages";
    });

    // Send user message
    builder.addCase(sendMessageAsync.pending, (state) => {
      state.sendingMessage = true;
      state.error = null;
    });
    builder.addCase(sendMessageAsync.fulfilled, (state, action) => {
      const { conversationId, userMessage } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(userMessage);
    });
    builder.addCase(sendMessageAsync.rejected, (state, action) => {
      state.sendingMessage = false;
      state.error = action.error.message || "Failed to send message";
    });

    // Send bot/system message
    builder.addCase(sendBotMessageAsync.fulfilled, (state, action) => {
      state.sendingMessage = false;
      const { conversationId, botMessage } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(botMessage);
    });
    builder.addCase(sendBotMessageAsync.rejected, (state, action) => {
      state.sendingMessage = false;
      state.error = action.error.message || "Failed to send bot message";
    });

    // Create conversation
    builder.addCase(createNewConversation.fulfilled, (state, action) => {
      state.conversations.push(action.payload);
      state.currentConversationId = action.payload.id;
      state.messagesByConversation[action.payload.id] = [];
    });

    // Delete conversation — optimistic
    builder.addCase(deleteConversationAsync.pending, (state, action) => {
      const deletedId = action.meta.arg;
      state.conversations = state.conversations.filter(
        (c) => c.id !== deletedId,
      );
      delete state.messagesByConversation[deletedId];
      if (state.currentConversationId === deletedId) {
        state.currentConversationId =
          state.conversations.length > 0 ? state.conversations[0].id : null;
      }
    });
    builder.addCase(deleteConversationAsync.fulfilled, () => {
      // already handled optimistically
    });

    // Archive / unarchive conversation
    builder.addCase(archiveConversationAsync.fulfilled, (state, action) => {
      const updated = action.payload;
      const idx = state.conversations.findIndex((c) => c.id === updated.id);
      if (idx !== -1) {
        state.conversations[idx] = updated;
      }
      // If the archived conversation was selected, clear selection
      if (
        updated.status === "archived" &&
        state.currentConversationId === updated.id
      ) {
        const firstActive = state.conversations.find(
          (c) => c.status === "active" && c.id !== updated.id,
        );
        state.currentConversationId = firstActive?.id ?? null;
      }
    });
  },
});

export const {
  setCurrentConversation,
  setUserId,
  clearUserId,
  clearError,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
