import { posts } from "@repo/db/data";
import { Main } from "@/components/Main";

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const filteredPosts = posts.filter((post) =>
    post.active && post.tags
      .split(",")
      .map((tag: string) => tag.trim().toLowerCase().replace(/\s+/g, '-'))
      .includes(name.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ padding: "1rem 2rem" }}>Tag: {name.replace('-', ' ')}</h1>
      {filteredPosts.length === 0 ? (
        <div style={{ padding: "1rem 2rem" }}>0 Posts</div>
      ) : (
        <Main posts={filteredPosts} />
      )}
    </div>
  );
}