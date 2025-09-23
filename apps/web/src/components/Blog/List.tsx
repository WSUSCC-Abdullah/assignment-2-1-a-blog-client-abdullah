import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem"; // Make sure this exists

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {posts.map((post) => (
        <li key={post.id} style={{ marginBottom: 32 }}>
          <BlogListItem post={post} />
        </li>
      ))}
    </ul>
  );
}

export default BlogList;