"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Header({ onSearch }: { onSearch?: (q: string) => void }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid #eee",
        background: "var(--header-bg, #fff)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Home Button (left) */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "8px 20px",
              background: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 1,
              cursor: "pointer",
            }}
          >
            Full Stack Blog
          </button>
        </Link>
      </div>
      {/* Search Bar (center) */}
      <div style={{ flex: 2, display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>
      {/* Dark Mode Button (right) */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            padding: "8px 16px",
            borderRadius: 4,
            border: "none",
            background: "#222",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </header>
  );
}