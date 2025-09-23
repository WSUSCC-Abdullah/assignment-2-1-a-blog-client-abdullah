import { posts } from "@repo/db/data";
import { Main } from "@/components/Main";

export default function Page({ params }: { params: { year: string; month: string } }) {
  const filteredPosts = posts.filter((post) => {
    const date = new Date(post.date);
    return (
      date.getFullYear().toString() === params.year &&
      (date.getMonth() + 1).toString().padStart(2, "0") === params.month
    );
  });

  return (
    <div>
      <h1 style={{ padding: "1rem 2rem" }}>
        History: {params.month}/{params.year}
      </h1>
      <Main posts={filteredPosts} />
    </div>
  );
}