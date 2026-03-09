import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Conversation, Message } from "../types/chat";
import {
  fetchConversations,
  fetchConversationMessages,
  sendMessage,
  createConversation,
  deleteConversation,
} from "../services/chatApi";

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentMessages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  error: string | null;
  userId: string | null;
  skipNextLoadMessages: boolean;
}

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  currentMessages: [],
  loadingConversations: false,
  loadingMessages: false,
  sendingMessage: false,
  error: null,
  userId: null,
  skipNextLoadMessages: false,
};

// Async thunks
export const loadConversations = createAsyncThunk(
  "chat/loadConversations",
  async (userId: string) => {
    return await fetchConversations(userId);
  },
);

export const loadMessages = createAsyncThunk(
  "chat/loadMessages",
  async (conversationId: string) => {
    const messages = await fetchConversationMessages(conversationId);
    return { conversationId, messages };
  },
);

export const sendMessageAsync = createAsyncThunk(
  "chat/sendMessage",
  async ({
    conversationId,
    message,
  }: {
    conversationId: string;
    message: string;
  }) => {
    const result = await sendMessage(conversationId, message);
    return { conversationId, ...result };
  },
);

export const createNewConversation = createAsyncThunk(
  "chat/createConversation",
  async ({ userId, title }: { userId: string; title: string | null }) => {
    return await createConversation({ userId, title, status: "active" });
  },
);

export const deleteConversationAsync = createAsyncThunk(
  "chat/deleteConversation",
  async (id: string) => {
    await deleteConversation(id);
    return id;
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
      // Set first conversation as current if none selected
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
      if (state.skipNextLoadMessages) {
        state.skipNextLoadMessages = false;
        return;
      }
      state.currentMessages = action.payload.messages;
    });
    builder.addCase(loadMessages.rejected, (state, action) => {
      state.loadingMessages = false;
      state.error = action.error.message || "Failed to load messages";
    });

    // Send message
    builder.addCase(sendMessageAsync.pending, (state, action) => {
      state.sendingMessage = true;
      state.error = null;
      // Add user message immediately (optimistic update)
      const userMessage: Message = {
        id: Date.now(),
        text: action.meta.arg.message,
        sender: "user",
        timestamp: new Date(),
      };
      state.currentMessages.push(userMessage);
    });
    builder.addCase(sendMessageAsync.fulfilled, (state, action) => {
      state.sendingMessage = false;
      // Add only bot message (user message already added in pending)
      state.currentMessages.push(action.payload.botMessage);
    });
    builder.addCase(sendMessageAsync.rejected, (state, action) => {
      state.sendingMessage = false;
      state.error = action.error.message || "Failed to send message";
      // Optionally: Remove the optimistically added user message on error
      // state.currentMessages.pop();
    });

    // Create conversation
    builder.addCase(createNewConversation.fulfilled, (state, action) => {
      state.conversations.push(action.payload);
      state.currentConversationId = action.payload.id;
      state.currentMessages = [];
      state.skipNextLoadMessages = true;
    });

    // Delete conversation — optimistic: remove immediately on pending
    builder.addCase(deleteConversationAsync.pending, (state, action) => {
      const deletedId = action.meta.arg;
      state.conversations = state.conversations.filter(
        (c) => c.id !== deletedId,
      );
      if (state.currentConversationId === deletedId) {
        state.currentConversationId =
          state.conversations.length > 0 ? state.conversations[0].id : null;
        state.currentMessages = [];
      }
    });
    builder.addCase(deleteConversationAsync.fulfilled, () => {
      // state already updated optimistically in pending
    });
  },
});

export const { setCurrentConversation, setUserId, clearUserId, clearError } =
  chatSlice.actions;
export default chatSlice.reducer;
