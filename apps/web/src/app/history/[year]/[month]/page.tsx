import { posts } from "@repo/db/data";
import { Main } from "@/components/Main";

export default async function Page({ params }: { params: Promise<{ year: string; month: string }> }) {
  const { year, month } = await params;
  const filteredPosts = posts.filter((post) => {
    const date = new Date(post.date);
    return (
      post.active &&
      date.getFullYear().toString() === year &&
      (date.getMonth() + 1).toString().padStart(2, "0") === month
    );
  });

  return (
    <div>
      <h1 style={{ padding: "1rem 2rem" }}>
        History: {month}/{year}
      </h1>
      {filteredPosts.length === 0 ? (
        <div style={{ padding: "1rem 2rem" }}>0 Posts</div>
      ) : (
        <Main posts={filteredPosts} />
      )}
    </div>
  );
}