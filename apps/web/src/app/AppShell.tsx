"use client";
import { useState, createContext } from "react";
import { Header } from "../components/Header";
import { CategoryList } from "../components/Menu/CategoryList";
import { TagList } from "../components/Menu/TagList";
import { HistoryList } from "../components/Menu/HistoryList";
import type { Post } from "@repo/db/data";

export const SearchContext = createContext<{
  search: string;
  setSearch: (s: string) => void;
}>({ search: "", setSearch: () => {} });

interface AppShellProps {
  children: React.ReactNode;
  posts: Post[];
}

export default function AppShell({ children, posts }: AppShellProps) {
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header */}
        <Header onSearch={setSearch} />
        
        {/* Main Layout */}
        <div style={{ display: "flex", flex: 1 }}>
          {/* Sidebar */}
          <aside style={{ 
            width: sidebarCollapsed ? "60px" : "250px", 
            background: "var(--sidebar-bg)", 
            padding: sidebarCollapsed ? "1rem 0.5rem" : "1rem", 
            borderRight: "1px solid var(--border-color)",
            transition: "width 0.3s ease, padding 0.3s ease",
            overflow: "hidden"
          }}>
            {/* Sidebar Toggle Button */}
            <div style={{ 
              display: "flex", 
              justifyContent: sidebarCollapsed ? "center" : "flex-end",
              marginBottom: "1rem" 
            }}>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? "→" : "←"}
              </button>
            </div>
            {!sidebarCollapsed && (
              <>
                {/* Categories Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    Categories
                  </h3>
                  <CategoryList posts={posts} />
                </div>

                {/* History Section */}
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    History
                  </h3>
                  <HistoryList posts={posts} />
                </div>

                {/* Tags Section */}
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    Tags
                  </h3>
                  <TagList posts={posts} />
                </div>
              </>
            )}
            
            {sidebarCollapsed && (
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                gap: "1rem" 
              }}>
                <div style={{ 
                  fontSize: "0.8rem", 
                  fontWeight: "bold", 
                  color: "var(--text-primary)",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed"
                }}>
                  Menu
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main style={{ 
            flex: 1, 
            padding: "2rem", 
            background: "var(--main-bg)", 
            color: "var(--text-primary)" 
          }}>
            {children}
          </main>
        </div>
      </div>
    </SearchContext.Provider>
  );
}