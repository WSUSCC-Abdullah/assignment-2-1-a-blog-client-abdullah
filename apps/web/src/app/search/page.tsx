import { posts } from "@repo/db/data";
import { Main } from "@/components/Main";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  
  const filteredPosts = posts.filter((post) => 
    post.active && (
      post.title.toLowerCase().includes(q?.toLowerCase() || '') ||
      post.description.toLowerCase().includes(q?.toLowerCase() || '')
    )
  );

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
