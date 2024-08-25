import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import ClaudeInterface from "./App.tsx";
import "./index.css";
import store from "./store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ClaudeInterface />
    </Provider>
  </StrictMode>
);
