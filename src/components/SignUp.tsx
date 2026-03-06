import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_BASE_URL}/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.message ||
          errorData?.error ||
          `Registration failed: ${response.statusText}`;
        throw new Error(message);
      }

      const data: { id: string } = await response.json();
      console.log("Registered with id:", data.id);
      setEmail("");
      setPassword("");
      setSuccessMessage("Account created successfully!");
    } catch (error) {
      console.error("Sign up error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              align="center"
              sx={{ mb: 5, fontWeight: 600 }}
            >
              Sign Up
            </Typography>

            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSignUp();
              }}
              sx={{ mt: 3 }}
            >
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                inputRef={passwordRef}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    passwordRef.current?.blur();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                fullWidth
                size="large"
                onClick={handleSignUp}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 3,
                  background: "transparent",
                  border: "2px solid transparent",
                  backgroundImage:
                    "linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #60a5fa, #34d399)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #60a5fa, #34d399)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  },
                }}
              >
                Sign Up
              </Button>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate("/")}
                    sx={{
                      cursor: "pointer",
                      color: "#60a5fa",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Login
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{
            width: "100%",
            bgcolor: "#1e1e1e",
            color: "white",
            borderLeft: "3px solid #22c55e",
            borderRadius: 1,
            "& .MuiAlert-icon": { color: "#22c55e" },
            "& .MuiIconButton-root": { color: "white" },
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{
            width: "100%",
            bgcolor: "#1e1e1e",
            color: "white",
            borderLeft: "3px solid #ef4444",
            borderRadius: 1,
            "& .MuiAlert-icon": { color: "#ef4444" },
            "& .MuiIconButton-root": { color: "white" },
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignUp;
