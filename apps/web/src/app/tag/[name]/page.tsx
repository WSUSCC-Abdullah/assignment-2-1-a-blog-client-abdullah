import { posts } from "@repo/db/data";
import { Main } from "@/components/Main";

export default function Page({ params }: { params: { name: string } }) {
  const filteredPosts = posts.filter((post) =>
    post.tags
      .split(",")
      .map((tag: string) => tag.trim().toLowerCase())
      .includes(params.name.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ padding: "1rem 2rem" }}>Tag: {params.name}</h1>
      <Main posts={filteredPosts} />
    </div>
  );
}