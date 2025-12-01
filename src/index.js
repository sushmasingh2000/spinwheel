import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import theme from "./utils/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";


const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
        <Toaster
          toastOptions={{
            className: "",
            style: {
              border: `1px solid orange`,
              color: "white",
              backgroundColor: "black",
              fontSize: "15px",
              marginTop: "100px",
              borderRadius: "50px",
            },
          }}
          autoClose={1000}
          limit={1}
        />
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>

);
