import { BlogList } from "./Blog/List";
import type { Post } from "@repo/db/data";

interface ClientHomeProps {
  posts: Post[];
  search: string;
}

export default function ClientHome({ posts, search }: ClientHomeProps) {
  const filteredPosts = posts.filter(p => p.active).filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return <BlogList posts={filteredPosts} />;
}