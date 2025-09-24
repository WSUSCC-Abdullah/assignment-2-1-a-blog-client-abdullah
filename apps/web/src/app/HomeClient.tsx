"use client";
import { useContext } from "react";
import ClientHome from "../components/ClientHome";
import { SearchContext } from "./AppShell";

interface HomeClientProps {
  posts: any[];
}

export default function HomeClient({ posts }: HomeClientProps) {
  const { search } = useContext(SearchContext);

  return <ClientHome posts={posts} search={search} />;
}