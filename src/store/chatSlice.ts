import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Chat, Message } from "../types/chat";
import {
  fetchConversations,
  fetchConversationMessages,
  sendMessage,
  createConversation,
} from "../services/chatApi";

interface ChatState {
  conversations: Chat[];
  currentConversationId: number | null;
  currentMessages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  error: string | null;
  userId: string | null;
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
};

// Async thunks
export const loadConversations = createAsyncThunk(
  "chat/loadConversations",
  async () => {
    const conversations = await fetchConversations();
    return conversations;
  },
);

export const loadMessages = createAsyncThunk(
  "chat/loadMessages",
  async (conversationId: number) => {
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
    conversationId: number;
    message: string;
  }) => {
    const result = await sendMessage(conversationId, message);
    return { conversationId, ...result };
  },
);

export const createNewConversation = createAsyncThunk(
  "chat/createConversation",
  async (name: string) => {
    const newChat = await createConversation(name);
    return newChat;
  },
);

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<number>) => {
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
    });
  },
});

export const { setCurrentConversation, setUserId, clearUserId, clearError } =
  chatSlice.actions;
export default chatSlice.reducer;
