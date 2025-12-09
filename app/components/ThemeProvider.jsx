"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    // Load theme from localStorage on mount
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            // Default to system preference or light
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                setTheme("dark");
            }
        }
    }, []);

    // Update HTML class and localStorage when theme changes
    useEffect(() => {
        const html = document.documentElement;
        if (theme === "dark") {
            html.classList.add("dark");
            html.classList.remove("light"); // Just in case
        } else {
            html.classList.remove("dark");
            html.classList.add("light");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        // We can expose the context if needed, but for now we might just need a toggle function passed down or available globally.
        // However, specifically for the toggle button in the navbar, we probably want a context.
        // Let's create a minimal context or just rely on passing props if we want to be simple? 
        // Actually, a global context is better to avoid prop drilling.
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Minimal Context Setup
import { createContext, useContext } from "react";
const ThemeContext = createContext({
    theme: "light",
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);
