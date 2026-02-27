import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Date objects
        ignoredActions: [
          "chat/loadMessages/fulfilled",
          "chat/sendMessage/fulfilled",
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.timestamp", "payload.messages"],
        // Ignore these paths in the state
        ignoredPaths: ["chat.currentMessages"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
