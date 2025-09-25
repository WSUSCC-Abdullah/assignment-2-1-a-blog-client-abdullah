import { searchPosts } from "@repo/db/service";
import { Main } from "@/components/Main";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  
  // Use server-side filtering for better performance
  const filteredPosts = q ? await searchPosts(q) : [];

  return (
    <div>
      <h1 style={{ padding: "1rem 2rem" }}>Search Results for: {q}</h1>
      {filteredPosts.length === 0 ? (
        <div style={{ padding: "1rem 2rem" }}>0 Posts</div>
      ) : (
        <Main posts={filteredPosts} />
      )}
    </div>
  );
}
