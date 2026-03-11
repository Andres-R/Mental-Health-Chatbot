import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loadConversations,
  loadMessages,
  sendMessageAsync,
  sendBotMessageAsync,
  createNewConversation,
  setCurrentConversation,
  clearUserId,
  deleteConversationAsync,
} from "../store/chatSlice";
import { MessageRole } from "../types/chat";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    currentConversationId,
    messagesByConversation,
    userId,
  } = useAppSelector((state) => state.chat);

  const currentMessages = useMemo(
    () =>
      currentConversationId
        ? (messagesByConversation[currentConversationId] ?? [])
        : [],
    [currentConversationId, messagesByConversation],
  );

  // Resolve userId from Redux state or localStorage fallback
  const resolvedUserId = userId ?? localStorage.getItem("userId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversations on mount
  useEffect(() => {
    if (resolvedUserId) {
      dispatch(loadConversations(resolvedUserId));
    }
  }, [dispatch, resolvedUserId]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId !== null) {
      dispatch(loadMessages(currentConversationId));
    }
  }, [currentConversationId, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleNewChat = () => {
    if (!resolvedUserId) return;
    dispatch(createNewConversation({ userId: resolvedUserId, title: null }));
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    dispatch(clearUserId());
    navigate("/");
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !resolvedUserId) return;

    let conversationId = currentConversationId;

    if (!conversationId) {
      try {
        const result = await dispatch(
          createNewConversation({ userId: resolvedUserId, title: null }),
        ).unwrap();
        conversationId = result.id;
      } catch {
        return;
      }
    }

    const messageText = inputMessage;
    setInputMessage("");

    // POST user message
    await dispatch(
      sendMessageAsync({
        conversationId,
        userId: resolvedUserId,
        message: messageText,
      }),
    ).unwrap();

    // Show loading animation after a 1-second delay
    const animationTimeout = setTimeout(() => {
      setShowLoadingAnimation(true);
    }, 1000);

    // Simulate a delay before the bot responds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    clearTimeout(animationTimeout);
    setShowLoadingAnimation(false);

    // Pick a random bot response and POST it
    const botResponses = [
      "Thank you for sharing that with me. How does that make you feel?",
      "I understand. That sounds challenging. Can you tell me more?",
      "It's completely normal to feel this way. What helps you cope?",
      "I'm here to listen. Would you like to explore this further?",
      "That's a great insight. How long have you been experiencing this?",
      "Remember, it's okay to take things one step at a time.",
    ];
    const botMessage =
      botResponses[Math.floor(Math.random() * botResponses.length)];

    dispatch(
      sendBotMessageAsync({
        conversationId,
        message: botMessage,
      }),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        bgcolor: "background.default",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Left Sidebar - Chat List */}
      <Box
        sx={{
          width: 280,
          height: "100%",
          bgcolor: "#242424",
          borderRight: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* New Chat Button */}
        <Box sx={{ p: 1.5, borderBottom: "1px solid #333" }}>
          <Button
            fullWidth
            onClick={handleNewChat}
            sx={{
              py: 1,
              borderRadius: 2,
              background: "transparent",
              border: "2px solid transparent",
              backgroundImage:
                "linear-gradient(#242424, #242424), linear-gradient(135deg, #60a5fa, #34d399)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundImage:
                  "linear-gradient(#2a2a2a, #2a2a2a), linear-gradient(135deg, #60a5fa, #34d399)",
              },
            }}
          >
            New Chat
          </Button>
        </Box>
        {/* Your Chats Label */}
        <Box sx={{ px: 1.5, pt: 1.5, pb: 0.75 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#888",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            your chats
          </Typography>
        </Box>
        <List sx={{ flex: 1, overflow: "hidden", py: 0 }}>
          {conversations.map((chat) => (
            <ListItem
              key={chat.id}
              disablePadding
              secondaryAction={
                currentConversationId === chat.id ? (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteConversationAsync(chat.id));
                    }}
                    sx={{ color: "#666", "&:hover": { color: "#ef4444" } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ) : undefined
              }
            >
              <ListItemButton
                selected={currentConversationId === chat.id}
                onClick={() => dispatch(setCurrentConversation(chat.id))}
                sx={{
                  py: 0.5,
                  px: 1.25,
                  pr: currentConversationId === chat.id ? 5 : 1.25,
                  "&.Mui-selected": {
                    bgcolor: "#1a1a1a",
                    borderLeft: "3px solid #60a5fa",
                  },
                  "&:hover": {
                    bgcolor: "#2a2a2a",
                  },
                }}
              >
                <ListItemText
                  primary={chat.title ?? "Untitled"}
                  primaryTypographyProps={{
                    fontWeight: currentConversationId === chat.id ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Top Bar with Logout Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 0.5,
            pr: 1.5,
            borderBottom: "1px solid #333",
            flexShrink: 0,
          }}
        >
          <Button
            onClick={handleLogout}
            sx={{
              py: 1,
              px: 3,
              borderRadius: 2,
              background: "transparent",
              border: "2px solid transparent",
              backgroundImage:
                "linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #60a5fa, #34d399)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundImage:
                  "linear-gradient(#242424, #242424), linear-gradient(135deg, #60a5fa, #34d399)",
              },
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {currentMessages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent:
                  msg.role === MessageRole.User ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  maxWidth: "70%",
                  p: 1.25,
                  bgcolor:
                    msg.role === MessageRole.User ? "#60a5fa" : "#242424",
                  color: "white",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: msg.role === MessageRole.User ? "right" : "left",
                    flex: 1,
                  }}
                >
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    fontSize: "0.7rem",
                    whiteSpace: "nowrap",
                    alignSelf: "flex-end",
                  }}
                >
                  {formatTime(msg.created_at)}
                </Typography>
              </Paper>
            </Box>
          ))}
          {showLoadingAnimation && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Paper
                sx={{
                  maxWidth: "70%",
                  p: 1.25,
                  bgcolor: "#242424",
                  color: "white",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "white",
                        animation: "bounce 1.4s infinite ease-in-out",
                        animationDelay: `${i * 0.16}s`,
                        "@keyframes bounce": {
                          "0%, 80%, 100%": {
                            transform: "translateY(0)",
                            opacity: 0.7,
                          },
                          "40%": {
                            transform: "translateY(-8px)",
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
          {currentMessages.length === 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Start a conversation...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid #333",
            bgcolor: "#242424",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#1a1a1a",
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "transparent",
                border: "2px solid transparent",
                backgroundImage: inputMessage.trim()
                  ? "linear-gradient(#242424, #242424), linear-gradient(135deg, #60a5fa, #34d399)"
                  : "none",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                color: inputMessage.trim() ? "white" : "#666",
                "&:hover": {
                  backgroundImage: inputMessage.trim()
                    ? "linear-gradient(#2a2a2a, #2a2a2a), linear-gradient(135deg, #60a5fa, #34d399)"
                    : "none",
                },
                "&:disabled": {
                  color: "#666",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
