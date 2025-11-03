// src/main.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// MUIテーマ設定（任意）
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // ブルー
    },
    secondary: {
      main: "#f50057", // ピンク
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={theme}>
      {/* MUIのデフォルトCSSをリセット */}
      <CssBaseline />
      <App />
    </ThemeProvider>
);
