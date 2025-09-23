"use client";
import { useContext } from "react";
import { posts } from "@repo/db/data";
import ClientHome from "../components/ClientHome";
import { SearchContext } from "./AppShell";

export default function Home() {
  const { search } = useContext(SearchContext);

  return <ClientHome posts={posts} search={search} />;
}