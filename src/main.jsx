import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import "./main.css";

import { BrowserRouter as Router, useRoutes } from "react-router-dom";

import routes from "~react-pages";

const App = () => {
  return (
    <div className="w-screen h-screen">
      <Suspense>{useRoutes(routes)}</Suspense>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);
