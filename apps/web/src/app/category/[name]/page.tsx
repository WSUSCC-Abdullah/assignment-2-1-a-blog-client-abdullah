import { getActivePosts } from "@repo/db/service";
import { Main } from "@/components/Main";

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const allPosts = await getActivePosts();
  const filteredPosts = allPosts.filter(
    (post) => post.active && post.category.toLowerCase() === name.toLowerCase()
  );

  return (
    <div>
      <h1 style={{ padding: "1rem 2rem" }}>Category: {name}</h1>
      {filteredPosts.length === 0 ? (
        <div style={{ padding: "1rem 2rem" }}>0 Posts</div>
      ) : (
        <Main posts={filteredPosts} />
      )}
    </div>
  );
}