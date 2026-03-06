import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import "./App.css";

function AuthRedirect() {
  const userId = localStorage.getItem("userId");
  return userId ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1a1a1a",
      paper: "#242424",
    },
    primary: {
      main: "#60a5fa",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a0a0a0",
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
