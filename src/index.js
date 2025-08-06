import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Import BrowserRouter from react-router-dom
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>   {/* ✅ Wrap App with BrowserRouter */}
    <App />
  </BrowserRouter>
);
