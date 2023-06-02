import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"
import "./main.css"

import { BrowserRouter as Router, useRoutes } from "react-router-dom"

import routes from "~react-pages"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

const App = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-green">
      <Suspense>{useRoutes(routes)}</Suspense>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <App />
    </Router>
  </QueryClientProvider>
)
