import { posts } from "@repo/db/data";
import { Main } from "@/components/Main";

export default function Page({ params }: { params: { name: string } }) {
  const filteredPosts = posts.filter(
    (post) => post.category.toLowerCase() === params.name.toLowerCase()
  );

  return (
    <div>
      <h1 style={{ padding: "1rem 2rem" }}>Category: {params.name}</h1>
      <Main posts={filteredPosts} />
    </div>
  );
}