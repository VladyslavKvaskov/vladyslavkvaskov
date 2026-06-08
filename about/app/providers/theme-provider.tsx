"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextProps {
  toggleTheme: () => void;
  mode: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeToggle = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeToggle must be used within ThemeProviderWrapper");
  return ctx;
};

export default function ThemeProviderWrapper({
  children,
  initialMode,
}: {
  children: ReactNode;
  initialMode: "dark" | "light";
}) {
  const [mode, setMode] = useState<"light" | "dark">(initialMode);

  const theme = createTheme({
    palette: {
      mode,
      background: {
        default: mode === "light" ? "#eff6ff" : "#121212",
      },
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            ...(mode === "light" && {
              backgroundColor: "#fff",
              color: theme.palette.text.primary,
              boxShadow: theme.shadows[1],
            }),
          }),
          popper: {
            zIndex: 10000,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === "light" ? "#eff6ff" : undefined,
          },
        },
      },
    },
  });
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      document.cookie = `theme=${newMode}; path=/; max-age=31536000`;

      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
