import { createContext, useContext, useState, useEffect } from "react";

const dark = {
  bg: "#0a0a12",
  cardBg: "rgba(255,255,255,0.02)",
  cardBgHover: "rgba(255,255,255,0.03)",
  cardBgSubtle: "rgba(255,255,255,0.015)",
  cardBgActive: "rgba(255,255,255,0.04)",
  overlay: "rgba(0,0,0,0.3)",
  overlayLight: "rgba(0,0,0,0.2)",
  text: "#e8e8e8",
  textStrong: "#fff",
  textHeading: "#ddd",
  textSecondary: "#ccc",
  textTertiary: "#bbb",
  textMuted: "#aaa",
  textMutedAlt: "#999",
  textDim: "#888",
  textDimAlt: "#777",
  textFaint: "#666",
  textFainter: "#555",
  textDimmer: "#444",
  textGhost: "#333",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.03)",
};

const light = {
  bg: "#f5f5f8",
  cardBg: "rgba(0,0,0,0.025)",
  cardBgHover: "rgba(0,0,0,0.04)",
  cardBgSubtle: "rgba(0,0,0,0.015)",
  cardBgActive: "rgba(0,0,0,0.05)",
  overlay: "rgba(0,0,0,0.06)",
  overlayLight: "rgba(0,0,0,0.04)",
  text: "#2a2a3a",
  textStrong: "#111",
  textHeading: "#222",
  textSecondary: "#444",
  textTertiary: "#555",
  textMuted: "#666",
  textMutedAlt: "#666",
  textDim: "#777",
  textDimAlt: "#777",
  textFaint: "#888",
  textFainter: "#999",
  textDimmer: "#aaa",
  textGhost: "#bbb",
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.12)",
  borderSubtle: "rgba(0,0,0,0.04)",
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("delta-v-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const theme = mode === "dark" ? dark : light;

  useEffect(() => {
    document.body.style.background = theme.bg;
    try {
      localStorage.setItem("delta-v-theme", mode);
    } catch {}
  }, [mode, theme.bg]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
