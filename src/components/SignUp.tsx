import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    // TODO: Implement sign up logic here
    console.log("Sign up clicked", { email, password });

    // For now, navigate to home after sign up attempt
    // Remove this line when implementing actual sign up
    navigate("/home");
  };

  return (
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

          <Box component="form" sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
                    "linear-gradient(#242424, #242424), linear-gradient(135deg, #60a5fa, #34d399)",
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
  );
}

export default SignUp;
