import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// list of useful commands!

// download typescript globally: (https://www.typescriptlang.org/download/)
//   npm install -g typescript

// check node version:
//   node -v

// list all node versions installed:
//   nvm list

// install a specific version of node:
//   nvm install 23

// use a specific version of node:
//   nvm use 23

// create project: (use Typescript)
//   npm create vite@latest mental-health-chatbot -- --template react-ts

// run project:
//   npm run dev
