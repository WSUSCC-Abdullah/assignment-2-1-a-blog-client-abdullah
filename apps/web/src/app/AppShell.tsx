"use client";
import { useState, createContext } from "react";
import { Header } from "../components/Header";
import { posts } from "@repo/db/data";
import { CategoryList } from "../components/Menu/CategoryList";
import { TagList } from "../components/Menu/TagList";
import { HistoryList } from "../components/Menu/HistoryList";

export const SearchContext = createContext<{
  search: string;
  setSearch: (s: string) => void;
}>({ search: "", setSearch: () => {} });

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <Header onSearch={setSearch} />
      <div style={{ display: "flex" }}>
        <aside
          style={{
            width: 220,
            padding: 16,
            background: "var(--sidebar-bg)",
            minHeight: "100vh",
            borderRight: "1px solid #eee",
          }}
        >
          {/* Home button removed */}
          <h3>Categories</h3>
          <CategoryList posts={posts} />
          <h3>History</h3>
          <HistoryList posts={posts} />
          <h3>Tags</h3>
          <TagList posts={posts} />
        </aside>
        <main style={{ flex: 1, padding: 32 }}>{children}</main>
      </div>
    </SearchContext.Provider>
  );
}